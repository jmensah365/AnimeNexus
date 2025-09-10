import { useMutation } from "@tanstack/react-query";
import * as service from '../services/AIService';

export const useGenAndInsetAIRecs = (token, navigate) => {
    return useMutation({
        mutationFn: () => service.generateAndInsertAiRecs(token),
        onSuccess: () => {
            navigate('/home');
        },
        onError: (error) => {
            console.error('Error generating AI recommendations:', error);
        }
    })
}