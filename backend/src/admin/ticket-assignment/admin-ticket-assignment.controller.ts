import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminTicketAssignmentService } from './admin-ticket-assignment.service';
import { AssignTicketsDto } from './dto/assign-tickets.dto';
import { QueryCompetitionsDto, QueryHistoryDto } from './dto/query-ticket-assignment.dto';

@ApiTags('Admin - Manual Ticket Assignment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('api/v1/admin/ticket-assignment')
export class AdminTicketAssignmentController {
  constructor(
    private readonly ticketAssignmentService: AdminTicketAssignmentService,
  ) {}

  @Get('competitions')
  @ApiOperation({
    summary: 'List active competitions for ticket assignment (Admin only)',
    description:
      'Returns active competitions with capacity, remaining tickets, host details, and instant win counts.',
  })
  @ApiResponse({ status: 200, description: 'Competitions successfully retrieved' })
  async getCompetitions(@Query() query: QueryCompetitionsDto) {
    return this.ticketAssignmentService.getCompetitions(query);
  }

  @Get('competitions/:id')
  @ApiOperation({
    summary: 'Get competition details for ticket assignment grid (Admin only)',
    description:
      'Returns stats, all instant wins, and list of sold tickets with buyer details and payment gateway.',
  })
  @ApiParam({ name: 'id', description: 'Competition ID' })
  @ApiResponse({ status: 200, description: 'Competition details retrieved' })
  @ApiResponse({ status: 404, description: 'Competition not found' })
  async getCompetitionById(@Param('id') id: string) {
    return this.ticketAssignmentService.getCompetitionById(id);
  }

  @Get('users/search')
  @ApiOperation({
    summary: 'Autocomplete search active users for ticket assignment (Admin only)',
    description: 'Searches users by email, firstName, lastName, or ID.',
  })
  @ApiQuery({ name: 'q', required: false, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'User search results' })
  async searchUsers(@Query('q') query?: string) {
    return this.ticketAssignmentService.searchUsers(query);
  }

  @Post('assign')
  @ApiOperation({
    summary: 'Manually assign competition tickets to a user (Admin only)',
    description:
      'Performs atomic ticket allocation, host wallet crediting, transaction tracking, instant win claims, and notification dispatches.',
  })
  @ApiResponse({ status: 201, description: 'Tickets successfully assigned' })
  @ApiResponse({ status: 400, description: 'Validation error or tickets unavailable' })
  @ApiResponse({ status: 404, description: 'User or Competition not found' })
  async assignTickets(@Req() req: any, @Body() dto: AssignTicketsDto) {
    const adminId = req.user?.sub || req.user?.id;
    return this.ticketAssignmentService.assignTickets(adminId, dto);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get paginated audit history of manual ticket assignments (Admin only)',
    description:
      'Returns past allocations with transaction details, recipient, competition, assigned numbers, and admin notes.',
  })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(@Query() query: QueryHistoryDto) {
    return this.ticketAssignmentService.getHistory(query);
  }
}
