package com.rentease.services;

import java.util.List;

import com.rentease.dtos.CategoryDTO;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Category;

public interface CategoryService {

	ResponseDto addCategory(CategoryDTO category);

	List<Category> getAll();

	Category getById(Long id);

	ResponseDto deleteCategory(Long id);

}
