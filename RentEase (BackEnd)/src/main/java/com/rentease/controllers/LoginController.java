package com.rentease.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentease.dtos.LoginRequestDto;
import com.rentease.dtos.RegisterUser;
import com.rentease.services.LoginService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class LoginController {
	private final LoginService userService;
	
	@PostMapping("/login")
	public ResponseEntity<?> login (@Valid @RequestBody LoginRequestDto loginRequest){
		return ResponseEntity.ok(userService.loginUser(loginRequest));
	}
	
//	@PostMapping("/register/buyer")
//	public ResponseEntity<?> registerBuyer(@Valid @RequestBody RegisterUser user){
//		return ResponseEntity.ok(userService.registerBuyer(user));
//	}
//	
//	@PostMapping("/register/owner")
//	public ResponseEntity<?> registerOwner(@Valid @RequestBody RegisterUser user){
//		return ResponseEntity.ok(userService.registerOwner(user));
//	}
}
