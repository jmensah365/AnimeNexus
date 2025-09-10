import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/preferenceService'

export const useCheckifFormIsCompleted = (navigateTo, setErrorMessage) => {
    return useMutation({
        mutationFn: (token) => service.checkifFormIsCompleted(token),
        onSuccess: (data) => {
            if (data.isCompleted) navigateTo('/home');
            else navigateTo('/auth/callback');
        },
        onError: (error) => {
            console.error("Failed to check form completion status: ", error);
            setErrorMessage("Failed to check form completion status:, error");
        }
    })
}

export const useUpdateFormCompletionStatus = (setErrorMessage) => {
    return useMutation({
        mutationFn: (token) => service.updatePreferenceFormCompletion(token),
        onError: (error) => {
            setErrorMessage("Failed to update preference form completion status.", error)
        }
    })
}

export const useFetchPreferences = (token) => {
    return useQuery({
        queryKey: ['fetchPreferences'],
        queryFn: () => service.fetchPreferences(token),
        refetchOnWindowFocus: false, 
        retry: 3, 
        enabled:!!token
    })
}

export const useInsertPreferences = (updateCompletionStatusMutation, token, navigate, setErrorMessage) => {
    return useMutation({
        mutationFn: (preferenceData) => service.insertPreferences(preferenceData,token),
        onSuccess: () => {
            updateCompletionStatusMutation.mutate(token);
            navigate('/welcome')
        },
        onError: (error) => {
            console.error("Failed to update preference form completion status: ", error);
            setErrorMessage("Failed to update preference form completion status.");
        }
    })
}

export const useUpdatePreferences = (token) => {
    return useMutation({
        mutationFn: (preferenceData) => service.updatePreferences(preferenceData, token)
    })
}