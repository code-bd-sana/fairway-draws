import { api } from './api';

export interface UserStats {
  totalUsers: number;
  newThisMonth: number;
  activeUsers: number;
  blockedUsers: number;
  activePercentage: string;
  blockedPercentage: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  location: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  ticketsCount: number;
  totalSpent: number;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HostData {
  id: string;
  userId: string;
  businessName: string;
  slug?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  walletBalance: number;
  revenue: number;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;

  // User profile details
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  isEmailVerified?: boolean;
  userCreatedAt?: string | null;

  // Plan & Subscription
  plan: string;
  subscription?: {
    id: string;
    planName: string;
    price: number;
    durationDays: number;
    maxActiveRaffles: number | null;
    status: string;
    startDate: string;
    endDate: string;
  } | null;

  // Stats & Competitions
  raffles: number;
  recentRaffles?: Array<{
    id: string;
    title: string;
    status: string;
    pricePerTicket: number;
    totalTickets: number;
    ticketsSold: number;
    createdAt: string;
  }>;
}

export interface GetHostsResponse {
  hosts: HostData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HostStats {
  totalHosts: number;
  activeHosts: number;
  blockedHosts: number;
  pendingHosts?: number;
}

export interface OrderData {
  id: string;
  orderId: string;
  buyerName: string;
  buyerInitials: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerLocation?: string;
  competition: string;
  tickets: number;
  ticketNumbers?: string[];
  amount: number;
  payment: string;
  gatewayTransactionId?: string;
  status: string;
  date: string;
}

export interface GetOrdersResponse {
  orders: OrderData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStats {
  totalOrders: number;
  totalTicketsSold: number;
  totalOrderValue: number;
  refundedOrders: number;
}


export interface LogData {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    initials: string;
    type: "admin" | "system" | "user";
  };
  description: string;
  ip: string;
  status: "Success" | "Failed";
}

export interface GetLogsResponse {
  logs: LogData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminDashboardOverview {
  stats: {
    totalUsers: number;
    activeHosts: number;
    liveRaffles: number;
    totalRevenue: number;
  };
  awaitingReview: {
    count: number;
    list: {
      id: string;
      title: string;
      sub: string;
      icon: string;
    }[];
  };
  topHosts?: {
    rank: number;
    id: string;
    name: string;
    revenue: string;
    initials: string;
  }[];
  recentActivity: {
    text: string;
    time: string;
    highlight: boolean;
    alert: boolean;
  }[];
}

export interface AdminReportsData {
  revenueTrend: { name: string; value: number }[];
  growthData?: { name: string; Users: number; Hosts: number }[];
  categorySales: { name: string; value: number; color: string }[];
  popularCompetitions: { name: string; value: number }[];
  userGrowth: { name: string; users: number }[];
  hostPerformance: { name: string; percent: number }[];
  geographicDistribution: { name: string; value: number }[];
}


export const adminService = {
  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string }): Promise<GetUsersResponse> {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  async getStats(): Promise<UserStats> {
    const { data } = await api.get('/admin/users/stats');
    return data;
  },

  async toggleBlockStatus(userId: string): Promise<User> {
    const { data } = await api.patch(`/admin/users/${userId}/block`);
    return data;
  },

  async getHosts(params: { page?: number; limit?: number; search?: string; status?: string }): Promise<GetHostsResponse> {
    const { data } = await api.get('/admin/hosts', { params });
    return data;
  },

  async getHostById(hostId: string): Promise<HostData> {
    const { data } = await api.get(`/admin/hosts/${hostId}`);
    return data;
  },

  async getHostStats(): Promise<HostStats> {
    const { data } = await api.get('/admin/hosts/stats');
    return data;
  },

  async approveHost(hostId: string): Promise<any> {
    const { data } = await api.patch(`/admin/hosts/${hostId}/approve`);
    return data;
  },

  async rejectHost(hostId: string): Promise<any> {
    const { data } = await api.patch(`/admin/hosts/${hostId}/reject`);
    return data;
  },

  async getOverviewStats(): Promise<AdminDashboardOverview> {
    const { data } = await api.get('/admin/dashboard/stats');
    return data;
  },

  async getSystemLogs(params: { page?: number; limit?: number; search?: string; filter?: string }): Promise<GetLogsResponse> {
    const { data } = await api.get('/admin/dashboard/logs', { params });
    return data;
  },

  async getReports(timeFilter: string = '3M'): Promise<AdminReportsData> {
    const { data } = await api.get('/admin/dashboard/reports', { params: { timeFilter } });
    return data;
  },

  async getOrders(params: { page?: number; limit?: number; search?: string }): Promise<GetOrdersResponse> {
    const { data } = await api.get('/admin/orders', { params });
    return data;
  },

  async getOrdersStats(): Promise<OrderStats> {
    const { data } = await api.get('/admin/orders/stats');
    return data;
  },

  async processRefund(transactionId: string, reason?: string): Promise<{ message: string; transaction: any }> {
    const { data } = await api.post(`/admin/orders/${transactionId}/refund`, { reason });
    return data;
  },

  async getAdminWithdrawals(): Promise<any[]> {
    const { data } = await api.get('/admin/withdrawals');
    return data;
  },

  async updateWithdrawalStatus(id: string, status?: 'APPROVED' | 'COMPLETED' | 'REJECTED', adminNotes?: string): Promise<any> {
    const { data } = await api.patch(`/admin/withdrawals/${id}/status`, { status, adminNotes });
    return data;
  },

  // Manual Ticket Assignment
  async getTicketAssignmentCompetitions(params?: { search?: string; hostId?: string }): Promise<AssignmentCompetitionSummary[]> {
    const { data } = await api.get('/admin/ticket-assignment/competitions', { params });
    return data;
  },

  async getTicketAssignmentCompetitionById(id: string): Promise<AssignmentCompetitionDetail> {
    const { data } = await api.get(`/admin/ticket-assignment/competitions/${id}`);
    return data;
  },

  async searchTicketAssignmentUsers(q?: string): Promise<AssignmentUser[]> {
    const { data } = await api.get('/admin/ticket-assignment/users/search', { params: { q } });
    return data;
  },

  async assignTickets(payload: AssignTicketsPayload): Promise<AssignTicketsResponse> {
    const { data } = await api.post('/admin/ticket-assignment/assign', payload);
    return data;
  },

  async getTicketAssignmentHistory(params?: { page?: number; limit?: number; search?: string; raffleId?: string }): Promise<AssignmentHistoryResponse> {
    const { data } = await api.get('/admin/ticket-assignment/history', { params });
    return data;
  },
};

export interface AssignmentCompetitionSummary {
  id: string;
  title: string;
  slug?: string;
  mainImage?: string;
  pricePerTicket: number;
  totalTickets: number;
  ticketsSold: number;
  remainingTickets: number;
  status: string;
  startDate?: string;
  endDate?: string;
  host: {
    id: string;
    businessName: string;
    user?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      avatarUrl: string | null;
    };
  };
  instantWinsCount: {
    total: number;
    unclaimed: number;
    claimed: number;
  };
}

export interface AssignmentSoldTicket {
  id: string;
  ticketNumber: number;
  purchaseDate: string;
  buyer: {
    id?: string;
    name: string;
    email?: string;
    avatarUrl?: string | null;
  };
  paymentGateway: string;
  transactionId?: string;
  gatewayTransactionId?: string;
  adminNotes?: string | null;
  isInstantWin: boolean;
  instantWinPrize?: string | null;
}

export interface AssignmentInstantWin {
  id: string;
  ticketNumber: number;
  prizeName: string;
  rrpValue: number | null;
  image?: string | null;
  isClaimed: boolean;
}

export interface AssignmentCompetitionDetail {
  id: string;
  title: string;
  slug?: string;
  mainImage?: string;
  description?: string;
  pricePerTicket: number;
  totalTickets: number;
  ticketsSold: number;
  remainingTickets: number;
  status: string;
  startDate?: string;
  endDate?: string;
  isAutoDraw?: boolean;
  autoDrawSoldOut?: boolean;
  host: {
    id: string;
    businessName: string;
    walletBalance: number;
    user?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      avatarUrl: string | null;
    };
  };
  instantWins: AssignmentInstantWin[];
  soldTickets: AssignmentSoldTicket[];
}

export interface AssignmentUser {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: string;
  avatar?: string | null;
}

export interface AssignTicketsPayload {
  raffleId: string;
  userId: string;
  ticketNumbers?: number[];
  quantity?: number;
  adminNotes?: string;
}

export interface AssignTicketsResponse {
  success: boolean;
  message: string;
  recipient: {
    id: string;
    name: string;
    email: string;
  };
  competition: {
    id: string;
    title: string;
    pricePerTicket: number;
    totalTickets: number;
    ticketsSold: number;
  };
  transaction: {
    id: string;
    gatewayTransactionId: string;
    amount: number;
    status: string;
    paymentGateway: string;
    adminNotes?: string | null;
    createdAt: string;
  };
  assignedNumbers: number[];
  ticketsCount: number;
  totalFinancialValue: number;
  hostWalletCredited: number;
  instantWins: Array<{
    winnerId?: string;
    ticketNumber: number;
    prizeName: string;
    rrpValue?: number | null;
    image?: string | null;
  }>;
  auditLogId?: string;
}

export interface AssignmentHistoryItem {
  id: string;
  gatewayTransactionId: string;
  date: string;
  totalAmount: number;
  adminNotes?: string | null;
  paymentGateway: string;
  status: string;
  recipient: {
    id?: string;
    name: string;
    email?: string;
    avatarUrl?: string | null;
  };
  competition?: {
    id: string;
    title: string;
    slug?: string;
    mainImage?: string;
    pricePerTicket: number;
  } | null;
  assignedNumbers: number[];
  ticketsCount: number;
  instantWinsCount: number;
  instantWins: any[];
}

export interface AssignmentHistoryResponse {
  history: AssignmentHistoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
