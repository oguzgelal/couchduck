import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

export type Settings = {
  name: string;
  country?: string;
  language?: string;
  streamingServices?: string[];
  formats?: string[];
  genres?: string[];
  dislikes?: string[];
};

const SETTINGS_QUERY_KEY = ["settings"];

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => apiFetch<Settings>("/settings"),
  });

  const update = useMutation({
    mutationFn: (patch: Partial<Settings>) =>
      apiFetch<Settings>("/settings", { method: "PATCH", body: JSON.stringify(patch) }),
    onMutate: (patch) => {
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, (settings) => settings && { ...settings, ...patch });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY }),
    scope: { id: "settings" },
  });

  return { settings: query.data, update: update.mutate };
}
