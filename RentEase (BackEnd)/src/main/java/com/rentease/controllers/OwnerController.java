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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.rentease.dtos.OwnerDTO;
import com.rentease.dtos.RegisterUser;
import com.rentease.services.OwnerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/owners")
@RequiredArgsConstructor
public class OwnerController {

	private final OwnerService ownerService;
	
	@PostMapping("/register")
	public ResponseEntity<?> registerOwner(@Valid @RequestBody RegisterUser user){
		return ResponseEntity.status(HttpStatus.CREATED).body(ownerService.register(user));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getOwner(@PathVariable Long id){
		return ResponseEntity.ok(ownerService.getOwnerById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id , @RequestBody OwnerDTO owner){
		return ResponseEntity.ok(ownerService.updateOwner(id , owner));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id){
		return ResponseEntity.ok(ownerService.deleteOwner(id));
	}
}
