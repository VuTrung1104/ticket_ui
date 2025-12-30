"use client";

import { useState } from "react";
import { bookingService, paymentService } from "@/lib";
import toast from "react-hot-toast";

export function useBooking() {
  const [loading, setLoading] = useState(false);

  // Step 1: Reserve seats (create booking)
  const holdSeats = async (showtimeId: string, seats: string[]) => {
    setLoading(true);
    try {
      const result = await bookingService.createBooking({ showtimeId, seats });
      toast.success("Đã giữ ghế, vui lòng thanh toán trong 5 phút");
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể giữ ghế";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create payment (VNPay/MoMo)
  const createPayment = async (
    bookingId: string,
    amount: number,
    method: "momo" | "vnpay" = "vnpay"
  ) => {
    setLoading(true);
    try {
      const result =
        method === "vnpay"
          ? await paymentService.createVNPayPayment({ bookingId, amount })
          : await paymentService.createMoMoPayment({ bookingId, amount });

      if (!result?.paymentUrl) {
        throw new Error("Không nhận được liên kết thanh toán");
      }

      // Redirect to the payment page
      window.location.href = result.paymentUrl;

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể tạo thanh toán";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Confirm booking after successful payment
  const confirmBooking = async (
    bookingId: string,
    paymentId: string,
    paymentMethod: "vnpay" | "momo" = "vnpay"
  ) => {
    setLoading(true);
    try {
      const result = await bookingService.confirmBooking(bookingId, {
        paymentMethod,
        transactionId: paymentId,
      });
      toast.success("Đặt vé thành công!");
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể xác nhận đặt vé";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    holdSeats,
    createPayment,
    confirmBooking,
  };
}
