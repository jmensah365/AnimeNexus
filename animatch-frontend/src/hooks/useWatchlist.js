import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/watchlistService'

export const useFetchWatchlistWithInfo = (token) =>
    useQuery({queryKey: ['fetchWatchlistWithInfo'], queryFn: () => service.fetchWatchlistWithInfo(token), refetchOnWindowFocus: false, retry: 3, enabled:!!token })

export const useFetchUserAnime = (token) =>
    useQuery({queryKey: ['fetchUserAnime'], queryFn: () => service.fetchUserAnime(token), refetchOnWindowFocus: false, retry: 3, enabled:!!token })

export const useCreateWatchlist = (token) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (animeData) => service.createWatchlist(animeData, token),
        onSuccess: () => queryClient.invalidateQueries(['fetchWatchlistWithInfo'])
    })  
    
}

export const useUpdateWatchlist = (token) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (animeData) => service.updateWatchlist(animeData,token),
        onSuccess: () => queryClient.invalidateQueries(['fetchWatchlistWithInfo'])
    } )
}

export const useDeleteWatchlist = (token) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (animeId) => service.deleteWatchlist(animeId, token),
        onSuccess: () => queryClient.invalidateQueries(['fetchWatchlistWithInfo']),
    })
}
