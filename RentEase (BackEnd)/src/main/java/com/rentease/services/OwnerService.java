package com.rentease.services;

import com.rentease.dtos.OwnerDTO;
import com.rentease.dtos.RegisterUser;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Owner;

public interface OwnerService {

	ResponseDto register( RegisterUser user);

	Owner getOwnerById(Long id);

	ResponseDto updateOwner(Long id, OwnerDTO user);

	ResponseDto deleteOwner(Long id);

}
