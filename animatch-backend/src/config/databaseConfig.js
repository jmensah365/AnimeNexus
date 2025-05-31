import {createClient} from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {auth: {autoRefreshToken: false, persistSession: false}});
export default supabase;