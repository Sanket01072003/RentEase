package com.rentease.payment.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefundRequest {

    @NotNull
    private Long rentalId;

    @NotNull
    private Double depositAmount;
}
