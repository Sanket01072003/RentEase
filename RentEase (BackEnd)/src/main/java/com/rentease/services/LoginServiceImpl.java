package com.rentease.services;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rentease.dtos.LoginRequestDto;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Admin;
import com.rentease.entities.Owner;
import com.rentease.entities.Renter;
import com.rentease.exceptions.CustomException;
import com.rentease.repositories.AdminRepository;
import com.rentease.repositories.OwnerRepository;
import com.rentease.repositories.RenterRepository;
import com.rentease.security.JwtService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

	private final PasswordEncoder passwordEncoder;
	private final OwnerRepository ownerRepo;
	private final RenterRepository renterRepo;
	private final AdminRepository adminRepo;
	private final JwtService jwtService;

	@Override
	public ResponseDto loginUser(LoginRequestDto loginRequest) {
		
		Admin admin = adminRepo.findByMail(loginRequest.getMail()).orElse(null);
	    if (admin != null) {
	        if (passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
	            String token = jwtService.generateToken(admin.getMail(), admin.getRole().name(), admin.getId());
	            return new ResponseDto("User Logged in Successfully!", "Success", LocalDateTime.now(), token);
	        } else {
	            throw new CustomException("Password not Correct!");
	        }
	    }
		
		Owner owner = ownerRepo.findByMail(loginRequest.getMail()).orElse(null);
		if (owner != null) {
			
			if (passwordEncoder.matches(loginRequest.getPassword(), owner.getPassword())) {
				// ✅ Generate JWT token
	            String token = jwtService.generateToken(
	                    owner.getMail(),
	                    owner.getRole().name(),
	            		owner.getId());
				return new ResponseDto("User Logged in Successfully!", "Success", LocalDateTime.now(), token);
			} else {
				throw new CustomException("Password not Correct!");
			}

		}
		
		Renter renter = renterRepo.findByMail(loginRequest.getMail()).orElse(null);
		if(renter != null) {
			if(passwordEncoder.matches(loginRequest.getPassword() , renter.getPassword())) {
				// ✅ Generate JWT token
	            String token = jwtService.generateToken(
	                    renter.getMail(),
	                    renter.getRole().name(),
	                    renter.getId());
				return new ResponseDto("User Logged in Successfully!", "Success", LocalDateTime.now(), token);
			}
			else {
				throw new CustomException("Password not Correct!");
			}
		}
		throw new CustomException("User not Registered!");
		
	}


}
