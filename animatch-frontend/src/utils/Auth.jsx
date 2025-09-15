import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "./supabaseClient";
import WelcomePage from "../pages/WelcomePage";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user);
            setLoading(false);
        });

        // Listen for login/logout
        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user);
                setSession(session);
            }
        );


        return () => subscription.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{user, session, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function RequireAuth({redirectTo}) {
    const {user, session, loading} = useAuth();

    if (loading) {
        return <WelcomePage/>;
    }

    if (!session) return <Navigate to={redirectTo} replace/>;

    return <Outlet/>

}