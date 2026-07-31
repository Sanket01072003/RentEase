package com.rentease.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rentease.ENUMs.RentalStatus;
import com.rentease.dtos.ResponseDto;
import com.rentease.dtos.ReviewDTO;
import com.rentease.entities.Products;
import com.rentease.entities.Rental;
import com.rentease.entities.Renter;
import com.rentease.entities.Review;
import com.rentease.exceptions.CustomException;
import com.rentease.repositories.ProductRepository;
import com.rentease.repositories.RentalRepository;
import com.rentease.repositories.RenterRepository;
import com.rentease.repositories.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
	
	private final ReviewRepository reviewRepository;
	private final RentalRepository rentalRepository;
	private final ProductRepository productRepository;
	private final RenterRepository renterRepository;
	
	@Override
	public ResponseDto add(ReviewDTO dto) {
		//check rental exists
		Rental rental = rentalRepository.findById(dto.getRentalId()).orElseThrow(() -> new CustomException("Rental Not Found!"));
		
		// Only allow review if rental is RETURNED
		if(rental.getStatus() != RentalStatus.RETURNED) {
			throw new CustomException("You can only review after returning the product!");
		}
		
		// Check review already exists for this rental
		if(reviewRepository.existsByRentalRentalId(dto.getRentalId())) {
			throw new CustomException("You have already reviewed this rental!");
		}
		
		// Validate rating
		if(dto.getRating() < 1 || dto.getRating() > 5) {
			throw new CustomException("Rating must be between 1 and 5!");
		}
		
		Renter renter = renterRepository.findById(dto.getRenterId()).orElseThrow(() -> new CustomException("Renter Not Found!"));
		
		Products product = productRepository.findById(dto.getProductId()).orElseThrow(() -> new CustomException("Product Not Found!"));
		
		Review review = new Review();
		review.setRenter(renter);
		review.setProduct(product);
		review.setRental(rental);
		review.setRating(dto.getRating());
		review.setComment(dto.getComment());
		
		Review saved = reviewRepository.save(review);
		
		// Link review to rental
		rental.setReview(saved);
		rentalRepository.save(rental);
		
		return new ResponseDto("Review Added Successfully!" , "Success" , LocalDateTime.now() , saved);
	}

	// ── Get Reviews by Product ────────────────────────────
	@Override
	public List<Review> getByProduct(Long productId) {
		return reviewRepository.findByProductProductId(productId);
	}

	 // ── Get Reviews by Renter ─────────────────────────────
//	@Override
//	public List<Review> getByRenter(Long renterId) {
//		return reviewRepository.findByRenterRenterId(renterId);
//	}
	
	@Override
	public List<Review> getByRenter(Long renterId) {
		return reviewRepository.findByRenterId(renterId);
	}

	// ── Get by ID ─────────────────────────────────────────
	@Override
	public Review getById(Long id) {
		return reviewRepository.findById(id).orElseThrow(() -> new CustomException("Review Not Found!"));
	}
	
	

}
