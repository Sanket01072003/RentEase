package com.rentease.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentease.dtos.CategoryDTO;
import com.rentease.services.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("categories")
@RequiredArgsConstructor
public class CategoryController {

	private final CategoryService categoryService;
	
	@PostMapping("/add")
	public ResponseEntity<?> add(@RequestBody CategoryDTO category){ 
		return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.addCategory(category));
	}
	
	@GetMapping("/all")
	public ResponseEntity<?> getAll(){
		return ResponseEntity.ok(categoryService.getAll());
	}
	
	@GetMapping("{id}")
	public ResponseEntity<?> get(@PathVariable Long id){
		return ResponseEntity.ok(categoryService.getById(id));
	}
	
	@DeleteMapping("{id}")
	public ResponseEntity<?> delete(@PathVariable Long id){
		return ResponseEntity.ok(categoryService.deleteCategory(id));
	}
}
