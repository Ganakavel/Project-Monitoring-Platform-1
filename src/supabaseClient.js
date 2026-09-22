import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://laxvmvrptqbhayfgyfri.supabase.co'
const supabaseKey = 'sb_publishable_d9OYdvo3BYGvKQry19FeaQ_yxwoDL9K'

export const supabase = createClient(supabaseUrl, supabaseKey)