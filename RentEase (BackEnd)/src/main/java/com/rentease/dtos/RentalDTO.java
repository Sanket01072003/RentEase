package com.rentease.dtos;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RentalDTO {
    private Long renterId;
    private Long productId;
    private LocalDate fromDate;
    private LocalDate toDate;
}