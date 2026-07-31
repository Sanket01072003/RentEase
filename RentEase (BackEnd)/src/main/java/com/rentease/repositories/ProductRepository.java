package com.rentease.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rentease.ENUMs.Availability;
import com.rentease.entities.Products;

public interface ProductRepository extends JpaRepository<Products, Long> {

	// Get all products by category
	List<Products> findByCategoryCategoryId(Long categoryId);

	// Get all products by owner
//	List<Products> findByOwnerOwnerId(Long ownerId);
	List<Products> findByOwnerId(Long ownerId);

	// Get all available products
	List<Products> findByStatus(Availability status);

	
}