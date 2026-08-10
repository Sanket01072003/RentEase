package com.rentease.payment.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PaymentOrderResponse {
    private String razorpayOrderId;
    private double amount;
    private String currency;
    private String keyId;
    private String renterName;
    private String renterMail;
}
