import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  "https://rzebwrjzcbigzmfxtlyz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZWJ3cmp6Y2JpZ3ptZnh0bHl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc2MjU1NSwiZXhwIjoyMDg2MzM4NTU1fQ.tDYoEgxcnAJO-4Yz2WA97ks7tDEW-ccHuXdz-9agqFE"
);

async function authenticateApiKey(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const apiKey = authHeader.replace("Bearer ", "");

  const { data } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key_hash", apiKey)
    .eq("is_active", true)
    .single();

  return data;
}

// POST /api/payments — Create a payment
export async function POST(request: NextRequest) {
  const keyData = await authenticateApiKey(request);
  if (!keyData) {
    return NextResponse.json(
      { error: { message: "Invalid or missing API key", type: "authentication_error" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { amount, currency, customer, description } = body;

    if (!amount || !customer) {
      return NextResponse.json(
        { error: { message: "Missing required fields: amount, customer", type: "invalid_request" } },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: { message: "Amount must be a positive number (in cents)", type: "invalid_request" } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("transactions").insert({
      user_id: keyData.user_id,
      type: "payment",
      amount: amount / 100,
      customer: customer,
    }).select().single();

    if (error) {
      return NextResponse.json(
        { error: { message: "Failed to create payment", type: "api_error" } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      object: "payment",
      amount: amount,
      currency: currency || "usd",
      customer: customer,
      description: description || null,
      status: "succeeded",
      created: data.created_at,
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body", type: "invalid_request" } },
      { status: 400 }
    );
  }
}

// GET /api/payments — List all payments
export async function GET(request: NextRequest) {
  const keyData = await authenticateApiKey(request);
  if (!keyData) {
    return NextResponse.json(
      { error: { message: "Invalid or missing API key", type: "authentication_error" } },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", keyData.user_id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json(
      { error: { message: "Failed to fetch payments", type: "api_error" } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    object: "list",
    data: data.map(t => ({
      id: t.id,
      object: "payment",
      amount: Math.round(Number(t.amount) * 100),
      currency: "usd",
      customer: t.customer,
      type: t.type,
      status: "succeeded",
      created: t.created_at,
    })),
    has_more: false,
  });
}