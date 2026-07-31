package com.rentease.services;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rentease.dtos.OwnerDTO;
import com.rentease.dtos.RegisterUser;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Owner;
import com.rentease.exceptions.CustomException;
import com.rentease.exceptions.DuplicateException;
import com.rentease.repositories.OwnerRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

	private final OwnerRepository ownerRepo; 
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public ResponseDto register(RegisterUser user) {
		if(ownerRepo.existsByMail(user.getMail())) {
			throw new DuplicateException("The Owner is ALready Registered , PLease Login!");
		}
		else {
			Owner owner = new Owner(null , user.getName() , user.getMail() , user.getPassword() , user.getPhone());
			owner.setPassword(passwordEncoder.encode(user.getPassword()));
			Owner saved = ownerRepo.save(owner);
			return new ResponseDto("Owner Registered Successfully" , "Success" , LocalDateTime.now() , saved);
		}
	}

	@Override
	public Owner getOwnerById(Long id) {
		return ownerRepo.findById(id).orElseThrow(() -> new CustomException("Owner Not Found !"));	
	}

	@Override
	public ResponseDto updateOwner(Long id, OwnerDTO user) {
		Owner owner = ownerRepo.findById(id).orElseThrow(() -> new CustomException("Owner not Found!"));
		owner.setName(user.getName());
		owner.setPhone(user.getPhone());
		Owner updated = ownerRepo.save(owner);
		return new ResponseDto("Owner Updated Successfully!" , "Success" , LocalDateTime.now() , updated);
	}

	@Override
	public ResponseDto deleteOwner(Long id) {
		ownerRepo.findById(id).orElseThrow(() -> new CustomException("Owner not Found!"));
		ownerRepo.deleteById(id);
		return new ResponseDto("Owner Deleted Successfully !" , "Success" , LocalDateTime.now() , null);
	}

}
