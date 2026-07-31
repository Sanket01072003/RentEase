package com.rentease.services;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rentease.dtos.RegisterUser;
import com.rentease.dtos.RenterDTO;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Renter;
import com.rentease.exceptions.CustomException;
import com.rentease.exceptions.DuplicateException;
import com.rentease.repositories.RenterRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RenterServiceImpl implements RenterService {

	private final RenterRepository renterRepo;
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public ResponseDto register( RegisterUser user) {
		if(renterRepo.existsByMail(user.getMail())) {
			throw new DuplicateException("The user Already Exists , Please Login !");
		}
		else {
			Renter renter = new Renter(null , user.getName() , user.getMail() , user.getPassword() , user.getPhone());
			renter.setPassword(passwordEncoder.encode(user.getPassword()));
			Renter saved = renterRepo.save(renter);
			return new ResponseDto("Renter Registered Successfully !" , "Success" , LocalDateTime.now() , saved);
		}
	}

	@Override
	public Renter getRenterByid(Long id) {
		return renterRepo.findById(id).orElseThrow(() -> new CustomException("Renter Not Found!"));
	}

	@Override
	public ResponseDto updateRenter(Long id, RenterDTO user) {
		Renter renter = renterRepo.findById(id).orElseThrow(() -> new CustomException("Renter Not Found!"));
		renter.setName(user.getName());
		renter.setPhone(user.getPhone());
		Renter updated = renterRepo.save(renter);
		return new ResponseDto("Renter Updated Successfully!" , "Success" , LocalDateTime.now() , updated);
	}

	@Override
	public ResponseDto deleteRenter(Long id) {
		renterRepo.findById(id).orElseThrow(() -> new CustomException("Renter Not Found!"));
		renterRepo.deleteById(id);
		return new ResponseDto("Renter Deleted Successfully!" , "Success" , LocalDateTime.now() , null);
	}

}
