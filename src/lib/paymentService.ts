import apiClient from "./apiClient";

interface PaymentData {
  _id: string;
  bookingId: string;
  amount: number;
  method: 'vnpay' | 'momo' | 'zalopay';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export const paymentService = {
  async createVNPayPayment(data: {
    bookingId: string;
    amount: number;
    bankCode?: string; 
    locale?: string; 
  }) {
    const response = await apiClient.post<{ 
      paymentId: string; 
      paymentUrl: string;
      bookingId: string;
    }>("/payments/vnpay/create", data);
    return response.data;
  },

  async createMoMoPayment(data: {
    bookingId: string;
    amount: number;
    orderInfo?: string;
  }) {
    const response = await apiClient.post<{ 
      paymentId: string; 
      paymentUrl: string;
      orderId: string;
    }>("/payments/momo/create", data);
    return response.data;
  },

  async handleVNPayCallback(params: URLSearchParams) {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      bookingId?: string;
      transactionId?: string;
    }>(`/payments/vnpay/callback?${params.toString()}`);
    return response.data;
  },

  async checkPaymentStatus(paymentId: string) {
    const response = await apiClient.get<{
      status: string;
      bookingId: string;
      amount: number;
      transactionId?: string;
      paidAt?: string;
    }>(`/payments/${paymentId}/status`);
    return response.data;
  },
  
  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    
    const query = queryParams.toString();
    const response = await apiClient.get<{
      data: PaymentData[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/payments${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getAllPayments(params?: {
    status?: string;
    bookingId?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.bookingId) queryParams.append("bookingId", params.bookingId);
    
    const query = queryParams.toString();
    const response = await apiClient.get<{
      data: PaymentData[];
    }>(`/payments${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getPaymentById(id: string) {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  async refundPayment(id: string) {
    const response = await apiClient.patch(`/payments/${id}/refund`);
    return response.data;
  },
};
