import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as service from '../services/reactionService'

export const useFetchReactionsWithInfo = (token) => {
    return useQuery({
        queryKey: ['fetchReactionsWithInfo'],
        queryFn: () => service.fetchReactionsWithInfo(token),
        refetchOnWindowFocus: false,
        retry: 3,
        enabled: !!token
    })
}

export const useCreateReaction = (token) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (reactionData) => service.createReaction(reactionData, token),
        onSuccess: () => queryClient.invalidateQueries(['fetchReactionsWithInfo'])
    })
}

export const useUpdateReaction = (token) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (reactionData) => service.updateReaction(reactionData,token),
        onSuccess: () => queryClient.invalidateQueries(['fetchReactionsWithInfo'])
    } )
}

export const useDeleteReaction = (token) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (reactionId) => service.deleteReaction(reactionId, token),
        onSuccess: () => queryClient.invalidateQueries(['fetchReactionsWithInfo']),
    })
}