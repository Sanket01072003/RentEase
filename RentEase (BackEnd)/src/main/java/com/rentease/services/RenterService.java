package com.rentease.services;

import com.rentease.dtos.RegisterUser;
import com.rentease.dtos.RenterDTO;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Renter;

public interface RenterService {

	ResponseDto register( RegisterUser user);

	Renter getRenterByid(Long id);

	ResponseDto updateRenter(Long id, RenterDTO user);

	ResponseDto deleteRenter(Long id);

}
