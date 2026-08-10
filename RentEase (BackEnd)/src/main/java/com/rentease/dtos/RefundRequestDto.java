package com.rentease.dtos;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RefundRequestDto {
    private Long rentalId;
    private Double depositAmount;
}