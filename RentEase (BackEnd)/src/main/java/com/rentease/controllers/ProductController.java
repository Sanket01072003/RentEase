package com.rentease.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentease.dtos.ProductDTO;
import com.rentease.services.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
//@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	// POST /api/products/add
	@PostMapping("/add")
	public ResponseEntity<?> add(@RequestBody ProductDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(productService.add(dto));
	}

	// GET /api/products/all
	@GetMapping("/all")
	public ResponseEntity<?> getAll() {
		return ResponseEntity.ok(productService.getAll());
	}

	// GET /api/products/available
	@GetMapping("/available")
	public ResponseEntity<?> getAllAvailable() {
		return ResponseEntity.ok(productService.getAllAvailable());
	}

	// GET /api/products/{id}
	@GetMapping("/{id}")
	public ResponseEntity<?> getById(@PathVariable Long id) {
		return ResponseEntity.ok(productService.getById(id));
	}

	// GET /api/products/category/{categoryId}
	@GetMapping("/category/{categoryId}")
	public ResponseEntity<?> getByCategory(@PathVariable Long categoryId) {
		return ResponseEntity.ok(productService.getByCategory(categoryId));
	}

	// GET /api/products/owner/{ownerId}
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<?> getByOwner(@PathVariable Long ownerId) {
		return ResponseEntity.ok(productService.getByOwner(ownerId));
	}

	// PUT /api/products/{id}
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ProductDTO dto) {
		return ResponseEntity.ok(productService.update(id, dto));
	}

	// DELETE /api/products/{id}
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		return ResponseEntity.ok(productService.delete(id));
	}
}