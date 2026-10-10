import { api } from './api';
import {
  CreateReviewPayload,
  HostDashboardReviewsResponse,
  HostReviewsResponse,
  UpdateReviewPayload,
  UserReview,
  ReviewItem,
} from '../types/review.types';

export const reviewService = {
  /**
   * Submit a verified winner review
   */
  async createReview(payload: CreateReviewPayload): Promise<ReviewItem> {
    const response = await api.post('/reviews', payload);
    return response.data;
  },

  /**
   * Get public paginated reviews and stats for a host
   */
  async getHostReviews(
    hostId: string,
    params?: { page?: number; limit?: number; rating?: number }
  ): Promise<HostReviewsResponse> {
    const response = await api.get(`/reviews/host/${hostId}`, { params });
    return response.data;
  },

  /**
   * Get all reviews submitted by the logged-in user
   */
  async getMyReviews(): Promise<UserReview[]> {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  /**
   * Get reviews received by the authenticated host with metrics
   */
  async getHostDashboardReviews(): Promise<HostDashboardReviewsResponse> {
    const response = await api.get('/reviews/host-dashboard');
    return response.data;
  },

  /**
   * Update a review comment/rating
   */
  async updateReview(id: string, payload: UpdateReviewPayload): Promise<ReviewItem> {
    const response = await api.patch(`/reviews/${id}`, payload);
    return response.data;
  },

  /**
   * Flag a review for admin moderation
   */
  async flagReview(id: string): Promise<{ message: string; review: ReviewItem }> {
    const response = await api.post(`/reviews/${id}/flag`);
    return response.data;
  },
};
