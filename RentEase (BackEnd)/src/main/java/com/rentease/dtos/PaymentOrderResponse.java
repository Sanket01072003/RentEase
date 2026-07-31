package com.rentease.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PaymentOrderResponse {
    private String razorpayOrderId;  // send to React
    private double amount;
    private String currency;
    private String keyId;            // send to React for checkout
    private String renterName;
    private String renterMail;
}