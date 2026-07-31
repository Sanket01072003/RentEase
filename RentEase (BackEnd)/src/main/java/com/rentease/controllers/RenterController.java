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

import com.rentease.dtos.RegisterUser;
import com.rentease.dtos.RenterDTO;
import com.rentease.services.RenterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/renters")
@RequiredArgsConstructor
public class RenterController {
	
	private final RenterService renterService;
	
	@PostMapping("/register")
	public ResponseEntity<?> registerRenter(@Valid @RequestBody RegisterUser user) {
		return ResponseEntity.status(HttpStatus.CREATED).body(renterService.register(user));
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getRenter(@PathVariable Long id){
		return ResponseEntity.ok(renterService.getRenterByid(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Long id , @RequestBody RenterDTO renter){
		return ResponseEntity.ok(renterService.updateRenter(id , renter));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id){
		return ResponseEntity.ok(renterService.deleteRenter(id));
	}
}
