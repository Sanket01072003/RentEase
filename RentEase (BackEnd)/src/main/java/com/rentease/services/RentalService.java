package com.rentease.services;

import java.util.List;

import com.rentease.dtos.RentalDTO;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Rental;

public interface RentalService {

	ResponseDto createRental(RentalDTO rental);

	Rental getByid(Long id);

	List<Rental> getByRenter(Long renterId);

	List<Rental> getByProduct(Long productId);

	ResponseDto confirmReturn(Long id);

	ResponseDto cancel(Long id);

}
