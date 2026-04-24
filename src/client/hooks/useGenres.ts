import { api } from "@client/api/axios";
import type { TGenre } from "@shared/types/game.types";
import { useQuery } from "@tanstack/react-query";





export function useGenres() {
    return useQuery({
        queryKey: ['genres'],
        queryFn: () => api.get<TGenre[]>('/genres').then(res => res.data)
    })
}