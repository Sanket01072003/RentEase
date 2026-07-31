package com.rentease.services;

import java.util.List;

import com.rentease.dtos.ProductDTO;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Products;

public interface ProductService {

	public ResponseDto add(ProductDTO dto);
	
	public List<Products> getAll();
	
	public List<Products> getAllAvailable();
	
	public Products getById(Long id);
	
	public List<Products> getByCategory(Long categoryId);
	
	public List<Products> getByOwner(Long ownerId);
	
	public ResponseDto update(Long id, ProductDTO dto);
	
	public ResponseDto delete(Long id);
	
}
