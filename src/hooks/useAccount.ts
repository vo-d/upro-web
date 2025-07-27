"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { UpdateAccountRequest } from "@/types/api";

export function useAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const accountQuery = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => api.getAccount(user!.id),
    enabled: !!user?.id,
  });

  const updateAccountMutation = useMutation({
    mutationFn: (updates: UpdateAccountRequest) =>
      api.updateAccount(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", user?.id] });
    },
    onError: (error: Error) => {
      console.error("Failed to update account:", error);
    },
  });

  return {
    account: accountQuery.data,
    isLoading: accountQuery.isLoading,
    error: accountQuery.error,
    updateAccount: updateAccountMutation.mutate,
    isUpdating: updateAccountMutation.isPending,
    updateError: updateAccountMutation.error,
  };
}
