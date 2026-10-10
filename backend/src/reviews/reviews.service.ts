import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryHostReviewsDto } from './dto/query-host-reviews.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * 1. POST /api/v1/reviews
   * Verified Reviewers Only, Exactly 1 review per winner record, Ownership verification.
   */
  async createReview(userId: string, dto: CreateReviewDto) {
    // 1. Verify winner record exists and belongs to logged-in user
    const winner = await this.prisma.winner.findUnique({
      where: { id: dto.winnerId },
      include: {
        raffle: {
          include: {
            host: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!winner) {
      throw new NotFoundException('Winning prize record not found');
    }

    if (winner.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to review this winning record',
      );
    }

    // 2. Check if a review already exists for this winner record
    const existingReview = await this.prisma.review.findUnique({
      where: { winnerId: dto.winnerId },
    });

    if (existingReview) {
      throw new ConflictException(
        'A review has already been submitted for this winning record',
      );
    }

    const hostId = winner.raffle.hostId;
    const raffleId = winner.raffleId;

    // 3. Create review with status 'APPROVED'
    const review = await this.prisma.review.create({
      data: {
        hostId,
        raffleId,
        winnerId: winner.id,
        userId,
        rating: dto.rating,
        comment: dto.comment?.trim() || null,
        status: 'APPROVED',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        raffle: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    // 4. Trigger system notification to host
    try {
      const hostUser = winner.raffle.host?.user;
      if (hostUser) {
        const reviewerName =
          `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() ||
          'A verified winner';

        await this.notificationsService.create({
          userId: hostUser.id,
          type: 'SYSTEM',
          title: '⭐ New Verified Winner Review',
          message: `${reviewerName} left a ${dto.rating}-star review on "${winner.raffle.title}".`,
          link: `/dashboard/host/performance`,
          metadata: {
            reviewId: review.id,
            raffleId: winner.raffleId,
            rating: dto.rating,
            winnerId: winner.id,
          },
        });
      }
    } catch (err) {
      this.logger.error('Failed to dispatch notification to host for review', err);
    }

    return review;
  }

  /**
   * 2. GET /api/v1/reviews/host/:hostId
   * Accepts page, limit, rating filter.
   * Returns paginated list of approved reviews with stats:
   * averageRating (1 decimal place or null), totalReviews, breakdown [1..5], percentages [1..5].
   */
  async getHostReviews(hostId: string, query: QueryHostReviewsDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    // Resolve hostId: support either hostProfile.id or hostProfile.slug
    let targetHostId = hostId;
    const hostProfile = await this.prisma.hostProfile.findFirst({
      where: {
        OR: [{ id: hostId }, { slug: hostId }],
      },
      select: { id: true },
    });

    if (hostProfile) {
      targetHostId = hostProfile.id;
    }

    // Base filter for approved reviews of this host
    const baseWhere = {
      hostId: targetHostId,
      status: 'APPROVED',
    };

    // Filter for paginated list (with optional rating filter)
    const listWhere: any = { ...baseWhere };
    if (query.rating) {
      listWhere.rating = Number(query.rating);
    }

    // 1. Fetch all approved reviews for aggregation stats (so stats reflect entire host profile)
    const allApprovedReviews = await this.prisma.review.findMany({
      where: baseWhere,
      select: { rating: true },
    });

    const totalReviews = allApprovedReviews.length;
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let ratingSum = 0;
    allApprovedReviews.forEach((r) => {
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (breakdown[star] !== undefined) {
        breakdown[star]++;
      }
      ratingSum += r.rating;
    });

    const averageRating =
      totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : null;

    const percentages = {
      1: totalReviews > 0 ? Math.round((breakdown[1] / totalReviews) * 100) : 0,
      2: totalReviews > 0 ? Math.round((breakdown[2] / totalReviews) * 100) : 0,
      3: totalReviews > 0 ? Math.round((breakdown[3] / totalReviews) * 100) : 0,
      4: totalReviews > 0 ? Math.round((breakdown[4] / totalReviews) * 100) : 0,
      5: totalReviews > 0 ? Math.round((breakdown[5] / totalReviews) * 100) : 0,
    };

    // 2. Fetch paginated list
    const [reviews, filteredCount] = await Promise.all([
      this.prisma.review.findMany({
        where: listWhere,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          raffle: {
            select: {
              id: true,
              title: true,
              slug: true,
              mainImage: true,
            },
          },
          winner: {
            select: {
              id: true,
              prizeName: true,
              winType: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where: listWhere }),
    ]);

    const formattedReviews = reviews.map((r) => {
      const reviewerName =
        `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() ||
        'Verified Winner';
      return {
        id: r.id,
        hostId: r.hostId,
        rating: r.rating,
        comment: r.comment,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        reviewerName,
        reviewerAvatar: r.user?.avatarUrl || null,
        raffleTitle: r.raffle?.title || 'Golf Competition',
        raffleSlug: r.raffle?.slug || null,
        prizeWon: r.winner?.prizeName || r.raffle?.title || 'Competition Prize',
        winType: r.winner?.winType || 'MAIN_DRAW',
      };
    });

    return {
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        total: filteredCount,
        totalPages: Math.ceil(filteredCount / limit),
      },
      stats: {
        averageRating,
        totalReviews,
        breakdown,
        percentages,
      },
    };
  }

  /**
   * 3. GET /api/v1/reviews/my-reviews
   * Returns all reviews submitted by the logged-in user.
   */
  async getMyReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        host: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            user: {
              select: {
                avatarUrl: true,
              },
            },
          },
        },
        raffle: {
          select: {
            id: true,
            title: true,
            slug: true,
            mainImage: true,
          },
        },
        winner: {
          select: {
            id: true,
            prizeName: true,
            winType: true,
          },
        },
      },
    });

    return reviews.map((r) => ({
      id: r.id,
      hostId: r.hostId,
      hostName: r.host.businessName,
      hostSlug: r.host.slug || r.host.id,
      hostLogo: r.host.user?.avatarUrl || null,
      winnerId: r.winnerId,
      rating: r.rating,
      comment: r.comment,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      raffleTitle: r.raffle.title,
      raffleSlug: r.raffle.slug,
      prizeWon: r.winner.prizeName,
      winType: r.winner.winType,
    }));
  }

  /**
   * 4. GET /api/v1/reviews/host-dashboard
   * Returns reviews received by the authenticated host with metrics (satisfaction rate, total reviews, breakdown).
   */
  async getHostDashboardReviews(userId: string) {
    const host = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });

    if (!host) {
      throw new NotFoundException('Host profile not found');
    }

    const reviews = await this.prisma.review.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        raffle: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        winner: {
          select: {
            id: true,
            prizeName: true,
            winType: true,
          },
        },
      },
    });

    const approvedReviews = reviews.filter((r) => r.status === 'APPROVED');
    const totalReviews = approvedReviews.length;

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;
    let positiveRatingsCount = 0; // 4 and 5 stars

    approvedReviews.forEach((r) => {
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (breakdown[star] !== undefined) {
        breakdown[star]++;
      }
      ratingSum += r.rating;
      if (r.rating >= 4) {
        positiveRatingsCount++;
      }
    });

    const averageRating =
      totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : null;

    const satisfactionRate =
      totalReviews > 0
        ? Math.round((positiveRatingsCount / totalReviews) * 100)
        : null;

    const formattedReviews = reviews.map((r) => {
      const reviewerName =
        `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() ||
        'Verified Winner';

      return {
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        status: r.status,
        createdAt: r.createdAt,
        reviewerName,
        reviewerAvatar: r.user?.avatarUrl || null,
        raffleTitle: r.raffle?.title || 'Competition',
        prizeWon: r.winner?.prizeName || r.raffle?.title || 'Prize',
        winType: r.winner?.winType || 'MAIN_DRAW',
      };
    });

    return {
      metrics: {
        totalReviews,
        averageRating,
        satisfactionRate, // e.g. 96%
        breakdown,
      },
      reviews: formattedReviews,
    };
  }

  /**
   * 5. PATCH /api/v1/reviews/:id
   * Edit review comment/rating (only creator can edit).
   */
  async updateReview(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.comment !== undefined && { comment: dto.comment.trim() || null }),
      },
    });

    return updated;
  }

  /**
   * 6. POST /api/v1/reviews/:id/flag
   * Flag suspicious reviews for moderation.
   */
  async flagReview(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        host: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Allowed if user is host of the review or an admin
    const hostUser = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });

    const isHostOwner = hostUser && hostUser.id === review.hostId;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === 'ADMIN';

    if (!isHostOwner && !isAdmin) {
      throw new ForbiddenException(
        'Only the reviewed host or an administrator can flag a review for moderation',
      );
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        status: 'FLAGGED',
      },
    });

    return {
      message: 'Review has been flagged for moderation review',
      review: updated,
    };
  }
}
