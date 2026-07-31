package com.rentease.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ProductDTO {
    private String productName;
    private String description;
    private double pricePerDay;
    private double depositAmount;
    private String imageUrl;
    private Long ownerId;
    private Long categoryId;
}