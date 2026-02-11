import { createBrowserClient } from '@supabase/ssr'  // ← CHANGE THIS LINE
import { config } from '../secrets'

export const supabase = createBrowserClient(  // ← CHANGE THIS LINE
  config.SUPABASE_PROJECT_URL,
  config.SUPABASE_ANON_KEY
)