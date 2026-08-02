import { createClient } from '@supabase/supabase-js'

// This is your actual, real Supabase project URL!
const supabaseUrl = 'https://agjktlotjbvlsxpgrjdf.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamt0bG90amJ2bHN4cGdyamRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NjYzNTMsImV4cCI6MjEwMTE0MjM1M30.nVDFittt609MFD_doCCuOgMordTBvxaUUGJBdZt_p9A'

export const supabase = createClient(supabaseUrl, supabaseKey)