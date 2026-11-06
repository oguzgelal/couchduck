import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { useConversationStore } from "../stores/conversation-store";

export function useClearHistory() {
  const queryClient = useQueryClient();
  const startNewConversation = useConversationStore((state) => state.startNewConversation);

  return useMutation({
    mutationFn: () => apiFetch<void>("/conversations", { method: "DELETE" }),
    onSuccess: () => {
      startNewConversation();
      queryClient.removeQueries({ queryKey: ["conversation"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
