package com.rentease.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ReviewDTO {
    private Long renterId;
    private Long productId;
    private Long rentalId;
    private int rating;       // 1 to 5
    private String comment;
}