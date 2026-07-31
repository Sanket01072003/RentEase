package com.rentease.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rentease.dtos.CategoryDTO;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Category;
import com.rentease.exceptions.CustomException;
import com.rentease.exceptions.DuplicateException;
import com.rentease.repositories.CategoryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
	
	private final CategoryRepository categoryRepo;
	
	@Override
	public ResponseDto addCategory(CategoryDTO category) {
		if(categoryRepo.existsByCategoryName(category.getCategoryName())) {
			throw new DuplicateException("Category Already Exixts!");
		}
		Category c = new Category();
		c.setCategoryName(category.getCategoryName());
		c.setDescription(category.getDescription());
		Category saved = categoryRepo.save(c);
		return new ResponseDto("Category Created Successfully!" , "Success" , LocalDateTime.now() , saved);
	}

	@Override
	public List<Category> getAll() {
		return categoryRepo.findAll();
	}

	@Override
	public Category getById(Long id) {
		return categoryRepo.findById(id).orElseThrow(() -> new CustomException("Category Not Found!"));
	}

	@Override
	public ResponseDto deleteCategory(Long id) {
		categoryRepo.findById(id).orElseThrow(() -> new CustomException("Category Not Found!"));
		categoryRepo.deleteById(id);
		return new ResponseDto("Category Deleted Successfully!" , "Success" , LocalDateTime.now() , null);
	}

}
