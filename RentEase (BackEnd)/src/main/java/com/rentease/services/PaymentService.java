package com.rentease.services;

import com.rentease.dtos.PaymentDTO;
import com.rentease.dtos.PaymentOrderResponse;
import com.rentease.entities.Payment;

public interface PaymentService {
    PaymentOrderResponse createOrder(Long rentalId); // ✅ updated
    Payment verifyAndSave(PaymentDTO dto);
    Payment refundDeposit(Long rentalId);            // ✅ new
    Payment getById(Long id);
}