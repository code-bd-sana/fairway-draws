import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AdminTicketAssignmentService } from './admin-ticket-assignment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RafflesService } from '../../raffles/raffles.service';
import { NotificationsService } from '../../notifications/notifications.service';

describe('AdminTicketAssignmentService', () => {
  let service: AdminTicketAssignmentService;
  let prismaMock: any;
  let rafflesServiceMock: any;
  let notificationsServiceMock: any;

  beforeEach(async () => {
    prismaMock = {
      raffle: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      ticket: {
        findMany: jest.fn(),
        createMany: jest.fn(),
      },
      transaction: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
      instantWin: {
        update: jest.fn(),
      },
      winner: {
        create: jest.fn(),
      },
      hostProfile: {
        update: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn(async (cb) => {
        return cb(prismaMock);
      }),
    };

    rafflesServiceMock = {
      drawWinner: jest.fn().mockResolvedValue(true),
    };

    notificationsServiceMock = {
      notifyUser: jest.fn().mockResolvedValue(true),
      notifyHost: jest.fn().mockResolvedValue(true),
      notifyAdmins: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminTicketAssignmentService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RafflesService, useValue: rafflesServiceMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
      ],
    }).compile();

    service = module.get<AdminTicketAssignmentService>(AdminTicketAssignmentService);
  });

  describe('assignTickets', () => {
    const adminId = 'admin-123';
    const activeRaffle = {
      id: 'raffle-1',
      title: 'TaylorMade Stealth 2 Driver',
      status: 'ACTIVE',
      totalTickets: 100,
      ticketsSold: 10,
      pricePerTicket: 5.0,
      hostId: 'host-1',
      isAutoDraw: true,
      autoDrawSoldOut: true,
      instantWins: [
        {
          id: 'iw-1',
          ticketNumber: 7,
          prizeName: 'Pro V1 Golf Balls Dozen',
          rrpValue: 50.0,
          isClaimed: false,
          image: null,
        },
      ],
    };

    const activeUser = {
      id: 'user-1',
      email: 'golfer@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isBlocked: false,
    };

    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.assignTickets(adminId, {
          raffleId: 'raffle-1',
          userId: 'non-existent',
          quantity: 2,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is blocked', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...activeUser,
        isBlocked: true,
      });

      await expect(
        service.assignTickets(adminId, {
          raffleId: 'raffle-1',
          userId: 'user-1',
          quantity: 2,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if requested specific ticket is already sold', async () => {
      prismaMock.user.findUnique.mockResolvedValue(activeUser);
      prismaMock.raffle.findUnique.mockResolvedValue(activeRaffle);
      prismaMock.ticket.findMany.mockResolvedValue([{ ticketNumber: 7 }]);

      await expect(
        service.assignTickets(adminId, {
          raffleId: 'raffle-1',
          userId: 'user-1',
          ticketNumbers: [7, 8],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully assign specific tickets, credit host wallet, claim instant win, and log audit', async () => {
      prismaMock.user.findUnique.mockResolvedValue(activeUser);
      prismaMock.raffle.findUnique.mockResolvedValue(activeRaffle);
      prismaMock.ticket.findMany
        .mockResolvedValueOnce([{ ticketNumber: 1 }]) // existing tickets
        .mockResolvedValueOnce([
          { id: 'tkt-7', ticketNumber: 7, transactionId: 'tx-1' },
          { id: 'tkt-14', ticketNumber: 14, transactionId: 'tx-1' },
        ]); // created tickets

      prismaMock.transaction.create.mockResolvedValue({
        id: 'tx-1',
        amount: 10.0,
        status: 'COMPLETED',
        paymentGateway: 'ADMIN_MANUAL',
        gatewayTransactionId: 'ADMIN_ASSIGN_123',
        adminNotes: 'VIP Member Bonus',
        createdAt: new Date(),
      });

      prismaMock.instantWin.update.mockResolvedValue({
        id: 'iw-1',
        ticketNumber: 7,
        prizeName: 'Pro V1 Golf Balls Dozen',
        isClaimed: true,
      });

      prismaMock.winner.create.mockResolvedValue({
        id: 'winner-1',
        raffleId: 'raffle-1',
        userId: 'user-1',
        ticketId: 'tkt-7',
        winType: 'INSTANT_WIN',
        prizeName: 'Pro V1 Golf Balls Dozen',
      });

      prismaMock.raffle.update.mockResolvedValue({
        ...activeRaffle,
        ticketsSold: 12,
      });

      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-1',
        adminId,
        action: 'ADMIN_MANUAL_TICKET_ASSIGNMENT',
      });

      const res = await service.assignTickets(adminId, {
        raffleId: 'raffle-1',
        userId: 'user-1',
        ticketNumbers: [7, 14],
        adminNotes: 'VIP Member Bonus',
      });

      expect(res.success).toBe(true);
      expect(res.assignedNumbers).toEqual([7, 14]);
      expect(res.totalFinancialValue).toBe(10.0);
      expect(res.hostWalletCredited).toBe(10.0);
      expect(res.instantWins.length).toBe(1);
      expect(res.instantWins[0].prizeName).toBe('Pro V1 Golf Balls Dozen');

      // Check host wallet was credited
      expect(prismaMock.hostProfile.update).toHaveBeenCalledWith({
        where: { id: 'host-1' },
        data: { walletBalance: { increment: 10.0 } },
      });

      // Check transaction was created with ADMIN_MANUAL
      expect(prismaMock.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            paymentGateway: 'ADMIN_MANUAL',
            amount: 10.0,
            status: 'COMPLETED',
          }),
        }),
      );

      // Check audit log was recorded
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            adminId,
            action: 'ADMIN_MANUAL_TICKET_ASSIGNMENT',
            targetRaffleId: 'raffle-1',
            recipientUserId: 'user-1',
            ticketNumbers: [7, 14],
            totalAmount: 10.0,
          }),
        }),
      );

      // Check user notification was dispatched
      expect(notificationsServiceMock.notifyUser).toHaveBeenCalledWith(
        'user-1',
        'PURCHASE',
        expect.any(String),
        expect.stringContaining('assigned 2 ticket(s)'),
        '/dashboard/user/tickets',
        expect.any(Object),
      );

      // Check instant win notifications
      expect(notificationsServiceMock.notifyUser).toHaveBeenCalledWith(
        'user-1',
        'WIN',
        expect.any(String),
        expect.stringContaining('Pro V1 Golf Balls Dozen'),
        '/dashboard/user/winners',
        expect.any(Object),
      );
    });

    it('should trigger auto-draw if allocation sells out the competition', async () => {
      prismaMock.user.findUnique.mockResolvedValue(activeUser);
      // Raffle with 99 out of 100 sold
      const almostFullRaffle = {
        ...activeRaffle,
        totalTickets: 100,
        ticketsSold: 99,
        instantWins: [],
      };
      prismaMock.raffle.findUnique.mockResolvedValue(almostFullRaffle);
      // Existing tickets 1..99
      const existing = Array.from({ length: 99 }, (_, i) => ({ ticketNumber: i + 1 }));
      prismaMock.ticket.findMany
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce([{ id: 'tkt-100', ticketNumber: 100, transactionId: 'tx-last' }]);

      prismaMock.transaction.create.mockResolvedValue({
        id: 'tx-last',
        amount: 5.0,
        status: 'COMPLETED',
        paymentGateway: 'ADMIN_MANUAL',
        gatewayTransactionId: 'ADMIN_ASSIGN_LAST',
      });

      prismaMock.raffle.update.mockResolvedValue({
        ...almostFullRaffle,
        ticketsSold: 100,
      });

      prismaMock.auditLog.create.mockResolvedValue({ id: 'audit-last' });

      await service.assignTickets(adminId, {
        raffleId: 'raffle-1',
        userId: 'user-1',
        quantity: 1,
      });

      // Since isAutoDraw && autoDrawSoldOut are true, drawWinner should be called
      expect(rafflesServiceMock.drawWinner).toHaveBeenCalledWith('raffle-1');
    });
  });
});
