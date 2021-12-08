package com.nashtech.assetmanagementwebservice.controller;

import java.util.List;

import com.nashtech.assetmanagementwebservice.exception.DuplicateRecordException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.nashtech.assetmanagementwebservice.model.dto.CategoryDTO;
import com.nashtech.assetmanagementwebservice.service.CategoryService;

import io.swagger.annotations.ApiOperation;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class CategoryController {
	private final CategoryService categoryService;
	private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
	
	@Autowired
	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}
	
	@ApiOperation(value = "Get All Categories", response = CategoryDTO.class,
            responseContainer = "List")
    @GetMapping(value = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        logger.info("Execute getAllCategories() inside CategoryController");
        List<CategoryDTO> categories = categoryService.getCategoryList();
        logger.info("Executed successful!");
        return ResponseEntity.ok(categories);
    }
	
	@ApiOperation(value = "Create A New Category", response = CategoryDTO.class)
    @PostMapping(value = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO payload) {
        logger.info("Execute createCategory() inside CategoryController");
        CategoryDTO result = null;
        try {
        	result = categoryService.createCategory(payload);
        } catch (DuplicateRecordException e) {
        	logger.error(e.getMessage());
        	return ResponseEntity.badRequest().build();
        }
        logger.info("Executed successful!");
        return ResponseEntity.ok(result);
    }
}
