import api from './api';
import type { DashboardStatsDto, OrderSummaryReportDto } from '../types';

export const reportService = {
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return (await api.get('/reports/dashboard')) as DashboardStatsDto;
  },

  async getOrderSummary(startDate?: string, endDate?: string): Promise<OrderSummaryReportDto> {
    const params = new URLSearchParams();

    if (startDate) {
      params.set('startDate', startDate);
    }

    if (endDate) {
      params.set('endDate', endDate);
    }

    const query = params.toString();
    return (await api.get(`/reports/orders${query ? `?${query}` : ''}`)) as OrderSummaryReportDto;
  },
};
