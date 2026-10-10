export interface VerifiedHost {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  category?: string;
  competitionCount: number;
  averageRating?: number | null;
  totalReviews?: number;
  isVerified: boolean;
  isBlocked?: boolean;
}
