import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
//const SUPABASE_URL = "https://gwxquybueoytkyzkbhuh.supabase.co";
//const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3eHF1eWJ1ZW95dGt5emtiaHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjQ1NzcsImV4cCI6MjA4MzAwMDU3N30.B2LD2USLdvkSKI3F3K0I4UpIWBZA0KTyB9LOmR5O81I";
//
//export const supabase = createClient(
//  SUPABASE_URL,
//  SUPABASE_ANON_KEY
//);