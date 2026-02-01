import { createClient } from '@supabase/supabase-js'
import { config } from '../secrets'

export const supabase = createClient(
  config.SUPABASE_PROJECT_URL,
  config.SUPABASE_ANON_KEY
);