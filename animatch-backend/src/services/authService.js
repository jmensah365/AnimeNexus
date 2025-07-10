import supabase from "../config/databaseConfig.js";

//This service handles user authentication, authorization, and session management using Supabase.

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

/* I set the session manually so I can ensure manually validate the session myself instead of relying on Supabase's automatic session management.
    I dont rely on Supabases automatic session management because I was running into issues with the session expiring too quickly*/
export const setUserSession = async (accessToken, refreshToken) => {
    return await supabase.auth.setSession({access_token: accessToken, refresh_token: refreshToken});
}