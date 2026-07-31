package com.rentease.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentease.dtos.RentalDTO;
import com.rentease.services.RentalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

	private final RentalService rentalService;
	
	@PostMapping("/create")
	public ResponseEntity<?> create(@RequestBody RentalDTO rental){
		return ResponseEntity.status(HttpStatus.CREATED).body(rentalService.createRental(rental));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getById(@PathVariable Long id){
		return ResponseEntity.ok(rentalService.getByid(id));
	}
	
	@GetMapping("/renter/{renterId}")
	public ResponseEntity<?> getByRenter(@PathVariable Long renterId){
		return ResponseEntity.ok(rentalService.getByRenter(renterId));
	}
	
	@GetMapping("/product/{productId}")
	public ResponseEntity<?> getByProduct(@PathVariable Long productId){
		return ResponseEntity.ok(rentalService.getByProduct(productId));
	}
	
	@PutMapping("/{id}/return")
	public ResponseEntity<?> confirmReturn(@PathVariable Long id){
		return ResponseEntity.ok(rentalService.confirmReturn(id));
	}
	
	@PutMapping("/{id}/cancel")
	public ResponseEntity<?> cancel(@PathVariable Long id){
		return ResponseEntity.ok(rentalService.cancel(id));
	}
}
