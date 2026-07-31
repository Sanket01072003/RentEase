package com.rentease.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentease.entities.Products;
import com.rentease.entities.Renter;
import com.rentease.entities.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	boolean existsByRentalRentalId(Long rentalId);

	List<Review> findByProductProductId(Long productId);

//	List<Review> findByRenterRenterId(Long renterId);
	List<Review> findByRenterId(Long renterId);

}
