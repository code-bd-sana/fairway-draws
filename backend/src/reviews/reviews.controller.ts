import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryHostReviewsDto } from './dto/query-host-reviews.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Reviews')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserId(req: Request): string {
    const user = (req as any).user;
    if (user?.id) return user.id;
    if (user?.sub) return user.sub;

    let token = req.cookies?.accessToken;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      throw new UnauthorizedException('No authentication token found');
    }
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * 1. POST /api/v1/reviews (Protected)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a verified winner review for a host' })
  @ApiResponse({ status: 201, description: 'Review submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 403, description: 'User does not own the winning record' })
  @ApiResponse({ status: 404, description: 'Winning prize not found' })
  @ApiResponse({ status: 409, description: 'Winning record has already been reviewed' })
  createReview(@Req() req: Request, @Body() dto: CreateReviewDto) {
    const userId = this.extractUserId(req);
    return this.reviewsService.createReview(userId, dto);
  }

  /**
   * 2. GET /api/v1/reviews/host/:hostId (Public)
   */
  @Get('host/:hostId')
  @ApiOperation({ summary: 'Get paginated reviews and aggregated stats for a host (public)' })
  @ApiParam({ name: 'hostId', description: 'HostProfile ID or slug' })
  @ApiResponse({ status: 200, description: 'Paginated reviews and rating summary' })
  getHostReviews(
    @Param('hostId') hostId: string,
    @Query() query: QueryHostReviewsDto,
  ) {
    return this.reviewsService.getHostReviews(hostId, query);
  }

  /**
   * 3. GET /api/v1/reviews/my-reviews (Protected)
   */
  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews submitted by the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of user reviews' })
  getMyReviews(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.reviewsService.getMyReviews(userId);
  }

  /**
   * 4. GET /api/v1/reviews/host-dashboard (Protected - Host only)
   */
  @Get('host-dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('HOST', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get host dashboard review metrics and received reviews' })
  @ApiResponse({ status: 200, description: 'Host review metrics and list' })
  getHostDashboardReviews(@Req() req: Request) {
    const userId = this.extractUserId(req);
    return this.reviewsService.getHostDashboardReviews(userId);
  }

  /**
   * 5. PATCH /api/v1/reviews/:id (Protected)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit review rating and comment' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot edit someone else review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  updateReview(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const userId = this.extractUserId(req);
    return this.reviewsService.updateReview(id, userId, dto);
  }

  /**
   * 6. POST /api/v1/reviews/:id/flag (Protected)
   */
  @Post(':id/flag')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Flag a review for admin moderation' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review flagged' })
  @ApiResponse({ status: 403, description: 'Unauthorized to flag' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  flagReview(@Req() req: Request, @Param('id') id: string) {
    const userId = this.extractUserId(req);
    return this.reviewsService.flagReview(id, userId);
  }
}
