export type ReviewStatus = 'APPROVED' | 'FLAGGED' | 'HIDDEN' | 'approved' | 'flagged' | 'under_review' | 'removed';

export type HostReview = ReviewItem;

export interface ReviewItem {
  id: string;
  hostId: string;
  rating: number;
  comment?: string | null;
  message?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
  reviewerName: string;
  reviewerAvatar?: string | null;
  raffleTitle?: string;
  raffleSlug?: string | null;
  competitionTitle?: string;
  prizeWon?: string;
  winType?: 'MAIN_DRAW' | 'INSTANT_WIN';
  canBeFlagged?: boolean;
}

export interface ReviewStats {
  averageRating: number | null;
  totalReviews: number;
  breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  percentages: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface HostReviewsResponse {
  reviews: ReviewItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: ReviewStats;
}

export interface UserReview {
  id: string;
  hostId: string;
  hostName: string;
  hostSlug: string;
  hostLogo: string | null;
  winnerId: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  raffleTitle: string;
  raffleSlug: string;
  prizeWon: string;
  winType: 'MAIN_DRAW' | 'INSTANT_WIN';
}

export interface HostDashboardReviewsResponse {
  metrics: {
    totalReviews: number;
    averageRating: number | null;
    satisfactionRate: number | null;
    breakdown: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  reviews: ReviewItem[];
}

export interface CreateReviewPayload {
  winnerId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}
