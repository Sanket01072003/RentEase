package com.rentease.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentease.dtos.ReviewDTO;
import com.rentease.services.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService reviewService;
	
	@PostMapping("/add")
	public ResponseEntity<?> add(@RequestBody ReviewDTO dto){
		return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.add(dto));
	}
	
	// ── Get Reviews by Product ────────────────────────────
	@GetMapping("/product/{productId}")
	public ResponseEntity<?> getByProduct(@PathVariable Long productId){
		return ResponseEntity.ok(reviewService.getByProduct(productId));
	}
	
	 // ── Get Reviews by Renter ─────────────────────────────
	@GetMapping("/renter/{renterId}")
	public ResponseEntity<?> getByRenter(@PathVariable Long renterId){
		return ResponseEntity.ok(reviewService.getByRenter(renterId));
	}
	
	// ── Get by ID ─────────────────────────────────────────
	@GetMapping("/{id}")
	public ResponseEntity<?> getById(@PathVariable Long id){
		return ResponseEntity.ok(reviewService.getById(id));
	}
	
}
