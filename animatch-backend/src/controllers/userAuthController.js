import { signUpUser, signInUser, signOut, updateUserEmail, updateUserPassword, refreshTokenSession, setUserSession } from '../services/authService.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

export const userSignIn = async (req, res) => {

    const userEmail = req.body.email;
    const userPassword = req.body.password;


    if (!userEmail) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!userPassword) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    try {
        const { data, error } = await signInUser(userEmail, userPassword);
        if (error) {
            return res.status(401).json({
                error: true,
                message: `There was an error when signing in: ${error.message}`,
            });
        }

        //store access and refresh tokens in cookies, DO NOT expose to JS
        // Note: maxAge for refresh token will be 15 days or * 60 * 60 * 24 * 15
        res.cookie("access-token", data.session.access_token, { httpOnly: true, maxAge: data.session.expires_in * 1000, path: '/', sameSite: 'strict', secure: false  });
        res.cookie("refresh-token", data.session.refresh_token, { httpOnly: true, maxAge: data.session.expires_in * 1000 * 60 * 60 * 24 * 15, path: '/', sameSite: 'strict', secure: false });


        // Successful signin
        return res.status(200).json({
            success: true,
            message: "Sign in was successful",
            user: {
                email: data.user.email,
                id: data.user.id
            },
            expires_at: new Date(Date.now() + data.session.expires_in * 1000).toISOString(),
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Server Error: ${error.message}`,
        });
    }

}

export const userSignUp = async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;


    // Validate input
    if (!userEmail) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!userPassword) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    try {
        // Call the signup function
        const { data, error } = await signUpUser(userEmail, userPassword);

        // Handle Supabase error
        if (error) {
            return res.status(400).json({
                error: true,
                message: `There was an error when signing up: ${error.message}`,
            });
        }
        // Successful signup
        return res.status(201).json({
            success: true,
            message: "Sign up was successful. Please check your email to confirm your account.",
            user: {
                email: data.user.email,
                id: data.user.id
            } ,
    });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Server Error: ${error.message}`,
        });
    }
}

export const userSignOut = async (req,res) => {
    try {
        const { error } = await signOut();
        if (error) {
            return res.status(400).json({
                error: true,
                message: `There was an error when signing out: ${error.message}`
            })
        }

        // Clear cookies
        res.clearCookie("access-token", {domain: 'localhost', path: '/'});
        res.clearCookie("refresh-token", {domain: 'localhost', path: '/'});

        return res.status(200).json({
            success: true,
            message: "User was successfully logged out",
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Server Error: ${error.message}`,
        })
    }

}

export const changeEmail = async (req, res) => {
    const email = req.body.email;

    //validate input
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    try {
        const { data, error } = await updateUserEmail(email);

        // Handle Supabase error
        if (error) {
            return res.status(400).json({
                error: true,
                message: `There was an error when changing your email: ${error.message}`,
            });
        }

        // Successful change
        return res.status(200).json({
            success: true,
            message: "Please go to your new email and confirm the email change.",
            user: data.user.email,
            confirmed_at: data.user.email_confirmed_at,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Server Error: ${error.message}`,
        })
    }
}

export const changePassword = async (req, res) => {
    const password = req.body.password;

    //validate input
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    try {
        const { data, error } = await updateUserPassword(password);

        // Handle Supabase error
        if (error) {
            return res.status(400).json({
                error: true,
                message: `There was an error when changing your password: ${error.message}`,
            });
        }

        // Successful change
        return res.status(200).json({
            success: true,
            message: "Your password has been changed!",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Server Error: ${error.message}`,
        })
    }
}

export const refreshToken = async (req, res) => {
    const refresh_token = req.cookies['refresh-token']
    console.log(`${refresh_token}`);
    if (!refresh_token) {
        return res.status(401).json({
            error: true,
            message: 'Refresh token is missing'
        })
    }

    try {
        const {data, error} = await refreshTokenSession(refresh_token);


        if (error) {
            return res.status(400).json({
                error: true,
                message: `Failed to refresh token: ${error.message}`
            });
        }

        //store access and refresh tokens in cookies, DO NOT expose to JS
        // Note: maxAge for refresh token will be 15 days or * 60 * 60 * 24 * 15
        res.cookie("access-token", data.session.access_token, { httpOnly: true, maxAge: data.session.expires_in * 1000, path: '/', sameSite: 'strict', secure: false  });
        res.cookie("refresh-token", data.session.refresh_token, { httpOnly: true, maxAge: data.session.expires_in * 1000 * 60 * 60 * 24 * 15, path: '/', sameSite: 'strict', secure: false });

        return res.status(200).json({
            success: true,
            message: "Token successfully refreshed",
            session: {
                "token_type": data.session.token_type,
                "expires_in": data.session.expires_in * 1000,
                "expires_at": data.session.expires_at
            },
            user: data.user.email,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Server Error: ${error.message}`,
        });
    }
}

export const validateSession = async (req, res) => {
    const access_token = req.cookies['access-token']
    const refresh_token = req.cookies['refresh-token']
    console.log(`Access Token: ${access_token}, Refresh Token: ${refresh_token}`);

    if (!access_token || !refresh_token) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to access this resource'
        });
    }

    try {
        const {data: {session}, error} = await setUserSession(access_token, refresh_token);
        if (error) {
            return res.status(401).json({
                error: true,
                message: `Unauthorized: ${error.message}`
            });
        }
        if (!session) {
            return res.status(401).json({
                error: true,
                message: 'Unauthorized: Invalid session'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Session is valid',
            user: {
                email: session.user.email,
                id: session.user.id
            },
            expires_at: session.expires_at
        });
    } catch (error) {   
        return res.status(500).json({
            error: true,
            message: `Server Error: ${error.message}`,
        });
    }
}
