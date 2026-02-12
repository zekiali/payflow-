import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rzebwrjzcbigzmfxtlyz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZWJ3cmp6Y2JpZ3ptZnh0bHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjI1NTUsImV4cCI6MjA4NjMzODU1NX0.oWcO4Y28xE9GpiXhPui4GwUkDMbpO7qcrkWtoqV014s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
