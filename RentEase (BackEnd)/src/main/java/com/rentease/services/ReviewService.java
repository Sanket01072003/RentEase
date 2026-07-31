package com.rentease.services;

import java.util.List;

import com.rentease.dtos.ResponseDto;
import com.rentease.dtos.ReviewDTO;
import com.rentease.entities.Products;
import com.rentease.entities.Renter;
import com.rentease.entities.Review;

public interface ReviewService {

	ResponseDto add(ReviewDTO dto);

	List<Review> getByProduct(Long productId);

	List<Review> getByRenter(Long renterId);

	Review getById(Long id);

}
