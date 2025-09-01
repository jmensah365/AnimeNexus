import supabaseAdmin from '../config/databaseAdminConfig.js';
import {createClient} from '@supabase/supabase-js'


export const supabaseAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ','');
    if (!token) return res.status(401).json({error: 'Missing auth token'});

    const {data: {user}, error} = await supabaseAdmin.auth.getUser(token);
    if (error) return res.status(401).json({error: error.message});

    req.user = user;

    req.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: {headers: {Authorization: `Bearer ${token}`}}
    });
    
    next();
}