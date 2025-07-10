import supabase from "../config/databaseConfig.js";


export const supabaseAuthMiddleware = async (req) => {
    // Get tokens from cookies
    const access_token = req.cookies['access-token']
    const refresh_token = req.cookies['refresh-token']

    // If tokens are not present, return an error
    if (!access_token || !refresh_token) {
        return {
            error: true,
            message: 'Unauthorized: Access token or refresh token is missing'
        }
    }

    try {
        //set the session using the access and refresh tokens
        const {data: { session }, error} = await supabase.auth.setSession({access_token, refresh_token});
        if (error) throw error;

        // Get the user associated with the session
        const {data: {user}, error: userError} = await supabase.auth.getUser();
        if (userError) throw userError;

        return {data: {session, user}, error: null};
    } catch (error) {
        return {error: true, message: `Authentication failed: ${error.message}`};
    }
}