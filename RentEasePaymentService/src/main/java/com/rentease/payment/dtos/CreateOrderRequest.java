package com.rentease.payment.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

// Main backend sends the amounts because this service has NO access
// to the Rental table (it's in a different database).
@Getter
@Setter
public class CreateOrderRequest {

    @NotNull
    private Long rentalId;

    @NotNull
    private Double totalRent;

    @NotNull
    private Double depositAmount;

    private String renterName;
    private String renterMail;
}
