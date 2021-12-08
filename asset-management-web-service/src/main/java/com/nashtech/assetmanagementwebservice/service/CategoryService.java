package com.nashtech.assetmanagementwebservice.service;

import java.util.List;

import com.nashtech.assetmanagementwebservice.model.dto.CategoryDTO;

public interface CategoryService {
	List<CategoryDTO> getCategoryList();
	
	CategoryDTO findCategoryById(Integer id);
	
	CategoryDTO createCategory(CategoryDTO payload);
}
