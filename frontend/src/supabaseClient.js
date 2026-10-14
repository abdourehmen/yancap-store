import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// التحقق من وجود المفاتيح لتجنب أخطاء التشغيل
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase Environment Variables!')
}

export const supabase = createClient(supabaseUrl, supabaseKey)