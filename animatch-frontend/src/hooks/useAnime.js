import { useMutation } from "@tanstack/react-query";
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

