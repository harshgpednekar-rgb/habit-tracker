import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cnrjetqzqzqqliopelqz.supabase.co'
const supabaseKey = 'YOUR_FULL_LONG_KEY_HERE' // Paste your full publishable key here

export const supabase = createClient(supabaseUrl, supabaseKey) // Forcing Git to see this file
