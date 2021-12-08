package com.nashtech.assetmanagementwebservice.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.nashtech.assetmanagementwebservice.exception.DuplicateRecordException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nashtech.assetmanagementwebservice.model.dto.CategoryDTO;
import com.nashtech.assetmanagementwebservice.entity.Category;
import com.nashtech.assetmanagementwebservice.exception.NotFoundException;
import com.nashtech.assetmanagementwebservice.model.mapper.CategoryMapper;
import com.nashtech.assetmanagementwebservice.repository.CategoryRepository;
import com.nashtech.assetmanagementwebservice.service.CategoryService;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
	private final CategoryRepository categoryRepository;
	private final CategoryMapper categoryMapper;
	private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);
	
	@Autowired
	public CategoryServiceImpl(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
		categoryMapper = new CategoryMapper();
	}

	@Override
	public List<CategoryDTO> getCategoryList() {
		logger.info("Attempting to get all Category...");
		List<Category> categories = categoryRepository.findAll();
		logger.info("Successfully got all " + categories.size() + " Category!");
		return categories.stream().map(categoryMapper::fromEntity).collect(Collectors.toList());
	}
	
	@Override
	public CategoryDTO findCategoryById(Integer id) {
		logger.info("Attempting to find Category with id " + id + "...");
		Category category = categoryRepository.getById(id);
		if (category == null) {
			throw new NotFoundException("No record found with id " + id);
		}
		logger.info("Successfully found a Category with id= " + category.getId() + ", prefix=" + 
		category.getPrefix() + ", name=" + category.getName() + "!");
		return categoryMapper.fromEntity(category);
	}

	@Override
	public CategoryDTO createCategory(CategoryDTO payload) {
		logger.info("Attempting to create new Category...");
		if (categoryRepository.getPrefixList().contains(payload.getPrefix())) {
			throw new DuplicateRecordException("Prefix must be unique");
		}
		if (categoryRepository.getNameList().contains(payload.getName())) {
			throw new DuplicateRecordException("Name must be unique");
		}
		Category category = categoryMapper.fromDTO(payload);
		categoryRepository.save(category);
		logger.info("Successfully created a Category with id= " + category.getId() + ", prefix=" + 
				category.getPrefix() + ", name=" + category.getName() + "!");
		return categoryMapper.fromEntity(category);
	}

}
