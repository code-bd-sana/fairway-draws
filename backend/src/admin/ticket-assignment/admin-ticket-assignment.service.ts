import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RafflesService } from '../../raffles/raffles.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { AssignTicketsDto } from './dto/assign-tickets.dto';
import { QueryCompetitionsDto, QueryHistoryDto } from './dto/query-ticket-assignment.dto';
import * as crypto from 'crypto';

@Injectable()
export class AdminTicketAssignmentService {
  private readonly logger = new Logger(AdminTicketAssignmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => RafflesService))
    private readonly rafflesService: RafflesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * 1. GET /competitions
   * Returns active competitions with stats, host details, and instant win counts.
   */
  async getCompetitions(query: QueryCompetitionsDto) {
    const where: any = {
      status: 'ACTIVE',
    };

    if (query.hostId) {
      where.hostId = query.hostId;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
        { host: { businessName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const competitions = await this.prisma.raffle.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            businessName: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        instantWins: {
          select: {
            id: true,
            ticketNumber: true,
            prizeName: true,
            isClaimed: true,
          },
        },
        _count: {
          select: {
            tickets: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return competitions.map((comp) => {
      const actualSold = comp._count.tickets;
      const remainingTickets = Math.max(0, comp.totalTickets - actualSold);
      const totalInstantWins = comp.instantWins.length;
      const claimedInstantWins = comp.instantWins.filter((iw) => iw.isClaimed).length;
      const unclaimedInstantWins = totalInstantWins - claimedInstantWins;

      return {
        id: comp.id,
        title: comp.title,
        slug: comp.slug,
        mainImage: comp.mainImage,
        pricePerTicket: Number(comp.pricePerTicket),
        totalTickets: comp.totalTickets,
        ticketsSold: actualSold,
        remainingTickets,
        status: comp.status,
        startDate: comp.startDate,
        endDate: comp.endDate,
        host: {
          id: comp.host?.id,
          businessName: comp.host?.businessName || 'Host',
          user: comp.host?.user,
        },
        instantWinsCount: {
          total: totalInstantWins,
          unclaimed: unclaimedInstantWins,
          claimed: claimedInstantWins,
        },
      };
    });
  }

  /**
   * 2. GET /competitions/:id
   * Returns full competition data with stats, all instant wins, and all sold tickets.
   */
  async getCompetitionById(id: string) {
    const raffle = await this.prisma.raffle.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            businessName: true,
            walletBalance: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        instantWins: {
          select: {
            id: true,
            ticketNumber: true,
            prizeName: true,
            rrpValue: true,
            image: true,
            isClaimed: true,
          },
          orderBy: { ticketNumber: 'asc' },
        },
        tickets: {
          select: {
            id: true,
            ticketNumber: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
            transaction: {
              select: {
                id: true,
                paymentGateway: true,
                gatewayTransactionId: true,
                adminNotes: true,
                amount: true,
              },
            },
          },
          orderBy: { ticketNumber: 'asc' },
        },
      },
    });

    if (!raffle) {
      throw new NotFoundException(`Competition with ID "${id}" was not found`);
    }

    const actualSold = raffle.tickets.length;
    const remainingTickets = Math.max(0, raffle.totalTickets - actualSold);

    const instantWinMap = new Map<number, any>();
    raffle.instantWins.forEach((iw) => instantWinMap.set(iw.ticketNumber, iw));

    const soldTickets = raffle.tickets.map((t) => {
      const buyerName =
        [t.user?.firstName, t.user?.lastName].filter(Boolean).join(' ').trim() ||
        t.user?.email ||
        'Anonymous Buyer';

      const iwMatch = instantWinMap.get(t.ticketNumber);

      return {
        id: t.id,
        ticketNumber: t.ticketNumber,
        purchaseDate: t.createdAt,
        buyer: {
          id: t.user?.id,
          name: buyerName,
          email: t.user?.email,
          avatarUrl: t.user?.avatarUrl,
        },
        paymentGateway: t.transaction?.paymentGateway || 'UNKNOWN',
        transactionId: t.transaction?.id,
        gatewayTransactionId: t.transaction?.gatewayTransactionId,
        adminNotes: t.transaction?.adminNotes || null,
        isInstantWin: Boolean(iwMatch),
        instantWinPrize: iwMatch?.prizeName || null,
      };
    });

    const instantWins = raffle.instantWins.map((iw) => ({
      id: iw.id,
      ticketNumber: iw.ticketNumber,
      prizeName: iw.prizeName,
      rrpValue: iw.rrpValue ? Number(iw.rrpValue) : null,
      image: iw.image,
      isClaimed: iw.isClaimed,
    }));

    return {
      id: raffle.id,
      title: raffle.title,
      slug: raffle.slug,
      mainImage: raffle.mainImage,
      description: raffle.description,
      pricePerTicket: Number(raffle.pricePerTicket),
      totalTickets: raffle.totalTickets,
      ticketsSold: actualSold,
      remainingTickets,
      status: raffle.status,
      startDate: raffle.startDate,
      endDate: raffle.endDate,
      isAutoDraw: raffle.isAutoDraw,
      autoDrawSoldOut: raffle.autoDrawSoldOut,
      host: {
        id: raffle.host?.id,
        businessName: raffle.host?.businessName || 'Host',
        walletBalance: Number(raffle.host?.walletBalance || 0),
        user: raffle.host?.user,
      },
      instantWins,
      soldTickets,
    };
  }

  /**
   * 3. GET /users/search?q=<term>
   * Live autocomplete search matching user email, firstName, lastName, or id.
   * Returns active users (excluding blocked accounts) with id, name, email, role, and avatar.
   */
  async searchUsers(query?: string) {
    const where: any = {
      isBlocked: false,
    };

    if (query && query.trim().length > 0) {
      const term = query.trim();
      where.OR = [
        { email: { contains: term, mode: 'insensitive' } },
        { firstName: { contains: term, mode: 'insensitive' } },
        { lastName: { contains: term, mode: 'insensitive' } },
        { id: { contains: term, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
      take: 25,
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => {
      const name =
        [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email;
      return {
        id: u.id,
        name,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        avatar: u.avatarUrl,
      };
    });
  }

  /**
   * 4. POST /assign
   * Validates within an atomic database transaction ($transaction):
   * - Treats tickets as fully paid in all accounting calculations.
   * - Calculates total amount and increments host wallet balance.
   * - Tracks transaction with paymentGateway === 'ADMIN_MANUAL'.
   * - Evaluates Instant Wins and creates Winner records.
   * - Records AuditLog entry.
   * - Sends in-app notifications.
   * - Automatically triggers auto-draw if sold out and auto-draw is configured.
   */
  async assignTickets(adminId: string, dto: AssignTicketsDto) {
    const { raffleId, userId, ticketNumbers, quantity, adminNotes } = dto;

    if (!ticketNumbers && (!quantity || quantity <= 0)) {
      throw new BadRequestException('You must provide either specific ticketNumbers or a positive quantity');
    }

    // Step 1: Pre-validation of User
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isBlocked: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Recipient user with ID "${userId}" not found`);
    }

    if (user.isBlocked) {
      throw new BadRequestException('Cannot assign tickets to a blocked user account');
    }

    // Step 2: Atomic Transaction execution
    const result = await this.prisma.$transaction(
      async (tx) => {
        // Fetch raffle with lock/latest data
        const raffle = await tx.raffle.findUnique({
          where: { id: raffleId },
          include: {
            instantWins: true,
            host: true,
          },
        });

        if (!raffle) {
          throw new NotFoundException(`Competition with ID "${raffleId}" not found`);
        }

        if (['ENDED', 'CANCELLED'].includes(raffle.status)) {
          throw new BadRequestException(
            `Cannot assign tickets to a competition with status "${raffle.status}"`,
          );
        }

        // Fetch all existing tickets
        const existingTickets = await tx.ticket.findMany({
          where: { raffleId },
          select: { ticketNumber: true },
        });

        const usedNumbers = new Set<number>(existingTickets.map((t) => t.ticketNumber));
        const actualSold = existingTickets.length;
        const remainingCapacity = raffle.totalTickets - actualSold;

        let assignedNumbers: number[] = [];

        if (ticketNumbers && ticketNumbers.length > 0) {
          // Specific ticket numbers requested
          const uniqueRequested = Array.from(new Set(ticketNumbers));
          if (uniqueRequested.length !== ticketNumbers.length) {
            throw new BadRequestException('Duplicate ticket numbers detected in your selection');
          }

          // Validate ranges
          for (const num of ticketNumbers) {
            if (!Number.isInteger(num) || num < 1 || num > raffle.totalTickets) {
              throw new BadRequestException(
                `Ticket #${num} is invalid. Numbers must be integers between 1 and ${raffle.totalTickets}.`,
              );
            }
          }

          // Verify none of the requested numbers are already sold
          const conflicts = ticketNumbers.filter((n) => usedNumbers.has(n));
          if (conflicts.length > 0) {
            throw new BadRequestException(
              `The following ticket number(s) have already been sold or allocated: ${conflicts.join(', ')}`,
            );
          }

          if (ticketNumbers.length > remainingCapacity) {
            throw new BadRequestException(
              `Requested ${ticketNumbers.length} tickets, but only ${remainingCapacity} tickets are remaining`,
            );
          }

          assignedNumbers = [...ticketNumbers].sort((a, b) => a - b);
        } else {
          // Random quantity requested
          const qty = Number(quantity);
          if (qty > remainingCapacity) {
            throw new BadRequestException(
              `Only ${remainingCapacity} tickets remaining in this competition. Cannot allocate ${qty}.`,
            );
          }

          const availablePool: number[] = [];
          for (let i = 1; i <= raffle.totalTickets; i++) {
            if (!usedNumbers.has(i)) {
              availablePool.push(i);
            }
          }

          if (availablePool.length < qty) {
            throw new BadRequestException('Not enough available ticket numbers to fulfill request');
          }

          // Fisher-Yates shuffle
          for (let i = availablePool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availablePool[i], availablePool[j]] = [availablePool[j], availablePool[i]];
          }

          assignedNumbers = availablePool.slice(0, qty).sort((a, b) => a - b);
        }

        const ticketQuantity = assignedNumbers.length;
        const unitPrice = Number(raffle.pricePerTicket || 0);
        const totalAmount = ticketQuantity * unitPrice;

        // Create Transaction record
        const gatewayTransactionId = `ADMIN_ASSIGN_${Date.now()}_${crypto.randomUUID()}`;
        const transaction = await tx.transaction.create({
          data: {
            userId: user.id,
            type: 'TICKET_PURCHASE',
            amount: totalAmount,
            status: 'COMPLETED',
            paymentGateway: 'ADMIN_MANUAL',
            gatewayTransactionId,
            relatedEntityId: raffle.id,
            adminNotes: adminNotes || null,
          },
        });

        // Bulk insert assigned tickets
        const ticketsData = assignedNumbers.map((num) => ({
          raffleId: raffle.id,
          userId: user.id,
          transactionId: transaction.id,
          ticketNumber: num,
        }));

        await tx.ticket.createMany({
          data: ticketsData,
        });

        // Retrieve created tickets with IDs
        const createdTickets = await tx.ticket.findMany({
          where: { transactionId: transaction.id },
          orderBy: { ticketNumber: 'asc' },
        });

        // Instant Win Prize Evaluation
        const userInstantWins: any[] = [];
        for (const ticket of createdTickets) {
          const matchedInstantWin = raffle.instantWins.find(
            (iw) => iw.ticketNumber === ticket.ticketNumber && !iw.isClaimed,
          );

          if (matchedInstantWin) {
            // Claim instant win
            const updatedInstantWin = await tx.instantWin.update({
              where: { id: matchedInstantWin.id },
              data: { isClaimed: true },
            });

            // Automatically create Winner record
            const winner = await tx.winner.create({
              data: {
                raffleId: raffle.id,
                userId: user.id,
                ticketId: ticket.id,
                winType: 'INSTANT_WIN',
                prizeName: updatedInstantWin.prizeName,
                deliveryStatus: 'PENDING',
                verificationStatus: 'PENDING',
                isClaimed: false,
              },
            });

            userInstantWins.push({
              winnerId: winner.id,
              ticketNumber: ticket.ticketNumber,
              ticketId: ticket.id,
              prizeName: updatedInstantWin.prizeName,
              rrpValue: updatedInstantWin.rrpValue ? Number(updatedInstantWin.rrpValue) : null,
              image: updatedInstantWin.image,
              isClaimed: false,
            });
          }
        }

        // Financial crediting: Update host wallet balance
        if (raffle.hostId && totalAmount > 0) {
          await tx.hostProfile.update({
            where: { id: raffle.hostId },
            data: {
              walletBalance: {
                increment: totalAmount,
              },
            },
          });
        }

        // Update raffle ticketsSold count
        const newTotalSold = actualSold + ticketQuantity;
        const updatedRaffle = await tx.raffle.update({
          where: { id: raffle.id },
          data: {
            ticketsSold: newTotalSold,
          },
        });

        // Audit Logging entry
        const auditLog = await tx.auditLog.create({
          data: {
            adminId,
            action: 'ADMIN_MANUAL_TICKET_ASSIGNMENT',
            targetRaffleId: raffle.id,
            recipientUserId: user.id,
            ticketNumbers: assignedNumbers,
            totalAmount: totalAmount,
            details: {
              adminNotes: adminNotes || null,
              raffleTitle: raffle.title,
              recipientEmail: user.email,
              recipientName:
                [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email,
              ticketCount: ticketQuantity,
              unitPrice,
              totalAmount,
              instantWinsCount: userInstantWins.length,
              instantWins: userInstantWins,
              transactionId: transaction.id,
              gatewayTransactionId,
            },
          },
        });

        return {
          raffle,
          updatedRaffle,
          transaction,
          createdTickets,
          assignedNumbers,
          userInstantWins,
          totalAmount,
          auditLog,
        };
      },
      {
        timeout: 20000,
      },
    );

    // Step 3: Check Auto-Draw condition if sold out
    if (
      result.updatedRaffle.ticketsSold >= result.updatedRaffle.totalTickets &&
      result.updatedRaffle.status === 'ACTIVE'
    ) {
      if (result.updatedRaffle.isAutoDraw && result.updatedRaffle.autoDrawSoldOut) {
        try {
          this.logger.log(
            `Competition "${result.updatedRaffle.title}" sold out via admin allocation. Triggering auto draw.`,
          );
          await this.rafflesService.drawWinner(result.updatedRaffle.id);
        } catch (err: any) {
          this.logger.error(
            `Failed to trigger auto draw on sold out for competition ${result.updatedRaffle.id}: ${err.message}`,
            err.stack,
          );
        }
      } else {
        try {
          await this.prisma.raffle.update({
            where: { id: result.updatedRaffle.id },
            data: { status: 'ENDED' },
          });
        } catch (err: any) {
          this.logger.error(
            `Failed to update raffle status to ENDED for ${result.updatedRaffle.id}: ${err.message}`,
          );
        }
      }
    }

    // Step 4: Dispatch in-app notifications
    try {
      const recipientName =
        [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;

      // 1. Recipient user ticket notification
      await this.notificationsService.notifyUser(
        user.id,
        'PURCHASE',
        '🎟️ Complimentary Tickets Issued',
        `An administrator has assigned ${result.assignedNumbers.length} ticket(s) for "${result.raffle.title}" to your account! Ticket numbers: #${result.assignedNumbers.join(', #')}. Good luck!`,
        '/dashboard/user/tickets',
        {
          raffleId: result.raffle.id,
          ticketNumbers: result.assignedNumbers,
          quantity: result.assignedNumbers.length,
          totalAmount: result.totalAmount,
          adminNotes: adminNotes || undefined,
        },
      );

      // 2. Instant Win alerts if any
      for (const win of result.userInstantWins) {
        // Recipient Winner notification
        await this.notificationsService.notifyUser(
          user.id,
          'WIN',
          '⚡ Instant Win Prize Won!',
          `Incredible news! Your assigned ticket #${win.ticketNumber} just won an instant prize: "${win.prizeName}"! Check your winners dashboard to claim.`,
          '/dashboard/user/winners',
          {
            raffleId: result.raffle.id,
            prizeName: win.prizeName,
            ticketNumber: win.ticketNumber,
          },
        );

        // Host notification
        if (result.raffle.hostId) {
          await this.notificationsService.notifyHost(
            result.raffle.hostId,
            'WIN',
            '⚡ Instant Win Prize Claimed',
            `An entrant won instant prize "${win.prizeName}" on ticket #${win.ticketNumber} for "${result.raffle.title}".`,
            '/dashboard/host/competitions',
            {
              raffleId: result.raffle.id,
              prizeName: win.prizeName,
              ticketNumber: win.ticketNumber,
            },
          );
        }

        // Admin alert
        await this.notificationsService.notifyAdmins(
          'WIN',
          '⚡ Instant Win Unlocked via Admin Assignment',
          `Admin assignment unlocked instant win "${win.prizeName}" on ticket #${win.ticketNumber} for "${result.raffle.title}" (Recipient: ${recipientName}).`,
          '/dashboard/admin/winners',
          {
            raffleId: result.raffle.id,
            prizeName: win.prizeName,
            ticketNumber: win.ticketNumber,
            recipientId: user.id,
          },
        );
      }
    } catch (notifErr: any) {
      this.logger.warn(`Failed to dispatch notifications: ${notifErr.message}`);
    }

    return {
      success: true,
      message: `Successfully assigned ${result.assignedNumbers.length} ticket(s) to ${user.email}`,
      recipient: {
        id: user.id,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email,
        email: user.email,
      },
      competition: {
        id: result.raffle.id,
        title: result.raffle.title,
        pricePerTicket: Number(result.raffle.pricePerTicket),
        totalTickets: result.raffle.totalTickets,
        ticketsSold: result.updatedRaffle.ticketsSold,
      },
      transaction: {
        id: result.transaction.id,
        gatewayTransactionId: result.transaction.gatewayTransactionId,
        amount: Number(result.transaction.amount),
        status: result.transaction.status,
        paymentGateway: result.transaction.paymentGateway,
        adminNotes: result.transaction.adminNotes,
        createdAt: result.transaction.createdAt,
      },
      assignedNumbers: result.assignedNumbers,
      ticketsCount: result.assignedNumbers.length,
      totalFinancialValue: result.totalAmount,
      hostWalletCredited: result.totalAmount,
      instantWins: result.userInstantWins,
      auditLogId: result.auditLog.id,
    };
  }

  /**
   * 5. GET /history
   * Paginated history of all ADMIN_MANUAL transactions showing:
   * Date, Transaction ID, Recipient, Competition, Assigned Numbers, Total Value, and Admin Notes.
   */
  async getHistory(query: QueryHistoryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      paymentGateway: 'ADMIN_MANUAL',
    };

    if (query.raffleId) {
      where.relatedEntityId = query.raffleId;
    }

    if (query.search && query.search.trim().length > 0) {
      const term = query.search.trim();
      where.OR = [
        { gatewayTransactionId: { contains: term, mode: 'insensitive' } },
        { id: { contains: term, mode: 'insensitive' } },
        { adminNotes: { contains: term, mode: 'insensitive' } },
        { user: { email: { contains: term, mode: 'insensitive' } } },
        { user: { firstName: { contains: term, mode: 'insensitive' } } },
        { user: { lastName: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatarUrl: true,
            },
          },
          tickets: {
            select: {
              id: true,
              ticketNumber: true,
              createdAt: true,
              raffle: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  mainImage: true,
                  pricePerTicket: true,
                },
              },
              winners: {
                select: {
                  id: true,
                  winType: true,
                  prizeName: true,
                  isClaimed: true,
                },
              },
            },
            orderBy: { ticketNumber: 'asc' },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    // Fetch related raffles for transactions that may not have tickets joined yet or for details
    const formattedHistory = transactions.map((t) => {
      const recipientName =
        [t.user?.firstName, t.user?.lastName].filter(Boolean).join(' ').trim() ||
        t.user?.email ||
        'User';

      const firstTicket = t.tickets[0];
      const competition = firstTicket?.raffle || null;
      const assignedNumbers = t.tickets.map((tkt) => tkt.ticketNumber);

      const instantWins = t.tickets
        .flatMap((tkt) => tkt.winners)
        .filter((w) => w.winType === 'INSTANT_WIN');

      return {
        id: t.id,
        gatewayTransactionId: t.gatewayTransactionId || t.id,
        date: t.createdAt,
        totalAmount: Number(t.amount),
        adminNotes: t.adminNotes,
        paymentGateway: t.paymentGateway,
        status: t.status,
        recipient: {
          id: t.user?.id,
          name: recipientName,
          email: t.user?.email,
          avatarUrl: t.user?.avatarUrl,
        },
        competition: competition
          ? {
              id: competition.id,
              title: competition.title,
              slug: competition.slug,
              mainImage: competition.mainImage,
              pricePerTicket: Number(competition.pricePerTicket),
            }
          : null,
        assignedNumbers,
        ticketsCount: assignedNumbers.length,
        instantWinsCount: instantWins.length,
        instantWins,
      };
    });

    return {
      history: formattedHistory,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
