import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://izzbmdswekuwqeshmgtr.supabase.co";  
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6emJtZHN3ZWt1d3Flc2htZ3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTQxNzMsImV4cCI6MjA1ODczMDE3M30.2XqC0OlyIRj0ANBNuY-ZFVmYArC42FxljZiEowcK0yo"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
