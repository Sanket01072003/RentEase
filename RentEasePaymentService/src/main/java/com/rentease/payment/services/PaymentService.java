package com.rentease.payment.services;

import com.rentease.payment.dtos.CreateOrderRequest;
import com.rentease.payment.dtos.PaymentOrderResponse;
import com.rentease.payment.dtos.RefundRequest;
import com.rentease.payment.dtos.VerifyPaymentRequest;
import com.rentease.payment.entities.Payment;

public interface PaymentService {
    PaymentOrderResponse createOrder(CreateOrderRequest request);
    Payment verifyAndSave(VerifyPaymentRequest request);
    Payment refundDeposit(RefundRequest request);
    Payment getById(Long id);
    Payment getByRentalId(Long rentalId);
}
