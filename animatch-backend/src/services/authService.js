import supabase from "../config/databaseConfig.js";

export const signUpUser = async (email, password) => {
    return await supabase.auth.signUp({
        email: email,
        password: password,
    });
}

export const signInUser = async (email, password) => {
    return await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
}

export const updateUserEmail = async (email) => {
    return await supabase.auth.updateUser({
        email: email,
    })
}

export const updateUserPassword = async (password) => {
    return await supabase.auth.updateUser({
        password: password,
    })
}

export const signOut = async () => {
    return await supabase.auth.signOut();
}

export const refreshTokenSession = async (refreshToken) => {
    return await supabase.auth.refreshSession({refresh_token: refreshToken});
}