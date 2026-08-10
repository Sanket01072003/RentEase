package com.rentease.services;

import com.rentease.dtos.PaymentOrderResponse;
import com.rentease.dtos.VerifyPaymentRequestDto;

public interface PaymentService {
    PaymentOrderResponse createOrder(Long rentalId); // ✅ updated
    Object verifyAndSave(VerifyPaymentRequestDto dto);
    Object refundDeposit(Long rentalId);            // ✅ new
    Object getByRentalId(Long id);
}