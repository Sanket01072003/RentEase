package com.rentease.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class VerifyPaymentRequestDto {
    // Sent from React after Razorpay success
    private Long rentalId;
    private String razorOrderId;
    private String razorPaymentId;
    private String razorSignature;   // for verification later
    private double totalAmount;
}