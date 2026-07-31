package com.rentease.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentease.entities.Rental;

public interface RentalRepository extends JpaRepository<Rental, Long> {

//	List<Rental> findByRenterRenterId(Long renterId);
//
	List<Rental> findByProductProductId(Long productId);

	List<Rental> findByRenterId(Long renterId);

//	List<Rental> findByProductId(Long productId);

}
