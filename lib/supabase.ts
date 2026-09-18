import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("DEBUG supabaseUrl:", supabaseUrl)
console.log("DEBUG supabaseAnonKey exists:", !!supabaseAnonKey)
console.log("DEBUG supabaseAnonKey length:", supabaseAnonKey?.length)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
