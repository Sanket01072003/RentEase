package com.rentease.dtos;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateOrderRequestDto {
    private Long rentalId;
    private Double totalRent;
    private Double depositAmount;
    private String renterName;
    private String renterMail;
}