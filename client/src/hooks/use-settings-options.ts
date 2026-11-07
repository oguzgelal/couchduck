import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";

type SettingsOptions = {
  streamingServices: string[];
  formats: string[];
  genres: string[];
  dislikes: string[];
};

const NO_OPTIONS: SettingsOptions = { streamingServices: [], formats: [], genres: [], dislikes: [] };

export function useSettingsOptions() {
  const { data } = useQuery({
    queryKey: ["settings-options"],
    queryFn: () => apiFetch<SettingsOptions>("/settings/options"),
    staleTime: Infinity,
  });
  return data ?? NO_OPTIONS;
}
