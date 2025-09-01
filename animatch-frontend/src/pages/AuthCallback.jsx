import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) return navigate('/login', {replace: true});

            //Check if user has completed more info survey
            const {data : data, error} = await supabase.from('preference_users').select('preference_survey_completed').eq('id', session.user.id).single();

            console.log(data.preference_survey_completed);

            if (error) throw error;

            // Redirect based on if suvery has been completed or not
            if (data.preference_survey_completed) navigate('/home', { replace: true });
            else navigate('/more-info', {replace:true})
        };

        checkSession();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600">Logging you in...</p>
        </div>
    );
}
