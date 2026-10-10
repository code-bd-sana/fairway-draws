import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/review.service';
import { CreateReviewPayload, UpdateReviewPayload } from '../types/review.types';

export const useHostReviewsQuery = (
  hostId: string,
  params?: { page?: number; limit?: number; rating?: number }
) => {
  return useQuery({
    queryKey: ['host-reviews', hostId, params?.page || 1, params?.limit || 10, params?.rating],
    queryFn: () => reviewService.getHostReviews(hostId, params),
    enabled: Boolean(hostId),
  });
};

export const useMyReviewsQuery = () => {
  return useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewService.getMyReviews(),
  });
};

export const useHostDashboardReviewsQuery = () => {
  return useQuery({
    queryKey: ['host-dashboard-reviews'],
    queryFn: () => reviewService.getHostDashboardReviews(),
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-winners'] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['host-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['host-dashboard-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['verified-hosts'] });
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) =>
      reviewService.updateReview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-winners'] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['host-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['host-dashboard-reviews'] });
    },
  });
};

export const useFlagReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewService.flagReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['host-dashboard-reviews'] });
    },
  });
};
