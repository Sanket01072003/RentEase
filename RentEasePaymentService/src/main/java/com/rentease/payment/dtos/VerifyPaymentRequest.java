package com.rentease.payment.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyPaymentRequest {

    @NotNull
    private Long rentalId;

    @NotBlank
    private String razorOrderId;

    @NotBlank
    private String razorPaymentId;

    @NotBlank
    private String razorSignature;

    @NotNull
    private Double totalAmount;
}
