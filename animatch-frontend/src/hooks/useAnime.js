import { useMutation, useQuery } from "@tanstack/react-query";
import * as service from "../services/animeService";

export const useGenAndInsertAnime = (token) => {
    return useMutation({
        mutationFn: () => service.generateAndInsertAnimeMetadata(token),
        onSuccess: () => {
            console.log("Inserted anime metadata into DB");
        },
        onError: (error) => {
            console.error("Error inserting anime metadata into DB: ", error);
        },
    });
};

export const useFetchKitsuAPI = () => {
    return useQuery({
        queryKey: ['kitsuApi'],
        queryFn: service.fetchKitsuApi,
        refetchOnWindowFocus: false,
        retry: 3,
    })
}

export const useFetchAnimeFromDB = (token) => {
    return useQuery({
        queryKey: ['animeFromDB'],
        queryFn: () => service.fetchAnimeFromDB(token),
        refetchOnWindowFocus: false,
        retry: 3,
        enabled: !!token
    })
}

export const useFetchAIRecs = (token) => {
    return useQuery({
        queryKey: ['aiRecs'],
        queryFn: () => service.fetchAiRecs(token),
        refetchOnWindowFocus: false,
        retry: 3,
        enabled: !!token,
    })
}

export const useGetTrendingAnime = () => {
    return useQuery({
        queryKey: ['getTrendingAnime'],
        queryFn: service.getTrendingAnime,
        refetchOnWindowFocus: false,
        retry: 3
    })
}