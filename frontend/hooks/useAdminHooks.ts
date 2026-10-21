import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, AdminDashboardOverview } from '../services/admin.service';

export const useAdminUsers = (params: { page?: number; limit?: number; search?: string; role?: string }) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getUsers(params),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useAdminHostStats = () => {
  return useQuery({
    queryKey: ['adminHostStats'],
    queryFn: adminService.getHostStats,
  });
};

export const useAdminOrders = (params: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['adminOrders', params],
    queryFn: () => adminService.getOrders(params),
  });
};

export const useAdminOrdersStats = () => {
  return useQuery({
    queryKey: ['adminOrdersStats'],
    queryFn: adminService.getOrdersStats,
  });
};

export const useProcessRefundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, reason }: { transactionId: string; reason?: string }) => 
      adminService.processRefund(transactionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrdersStats'] });
    },
  });
};

export const useAdminUsersStats = () => {
  return useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: () => adminService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useToggleUserBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.toggleBlockStatus(userId),
    onSuccess: () => {
      // Invalidate both users list and stats to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminOverviewStats = (options?: any) => {
  return useQuery<AdminDashboardOverview>({
    queryKey: ['adminOverviewStats'],
    queryFn: () => adminService.getOverviewStats(),
    ...options,
  });
};

export const useAdminLogs = (params: { page?: number; limit?: number; search?: string; filter?: string }) => {
  return useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: () => adminService.getSystemLogs(params),
  });
};

export const useAdminWithdrawals = () => {
  return useQuery({
    queryKey: ['adminWithdrawals'],
    queryFn: () => adminService.getAdminWithdrawals(),
    staleTime: 30 * 1000,
  });
};

export const useUpdateWithdrawalStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: string; status?: 'APPROVED' | 'COMPLETED' | 'REJECTED'; adminNotes?: string }) =>
      adminService.updateWithdrawalStatus(id, status, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['adminOverviewStats'] });
    },
  });
};

export const useAdminTicketAssignmentCompetitions = (params?: { search?: string; hostId?: string }) => {
  return useQuery({
    queryKey: ['adminTicketAssignmentCompetitions', params],
    queryFn: () => adminService.getTicketAssignmentCompetitions(params),
    staleTime: 30 * 1000,
  });
};

export const useAdminTicketAssignmentCompetition = (id?: string) => {
  return useQuery({
    queryKey: ['adminTicketAssignmentCompetition', id],
    queryFn: () => adminService.getTicketAssignmentCompetitionById(id!),
    enabled: Boolean(id),
    staleTime: 10 * 1000,
  });
};

export const useAdminTicketAssignmentHistory = (params?: { page?: number; limit?: number; search?: string; raffleId?: string }) => {
  return useQuery({
    queryKey: ['adminTicketAssignmentHistory', params],
    queryFn: () => adminService.getTicketAssignmentHistory(params),
    staleTime: 15 * 1000,
  });
};

export const useAdminAssignTicketsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.assignTickets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTicketAssignmentCompetitions'] });
      queryClient.invalidateQueries({ queryKey: ['adminTicketAssignmentCompetition'] });
      queryClient.invalidateQueries({ queryKey: ['adminTicketAssignmentHistory'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOverviewStats'] });
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['my-transactions'] });
    },
  });
};
