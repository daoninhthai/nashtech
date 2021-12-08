package com.nashtech.assetmanagementwebservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nashtech.assetmanagementwebservice.entity.Category;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
	@Query("SELECT c.prefix from Category c")
	List<String> getPrefixList();
	
	@Query("SELECT c.name from Category c")
	List<String> getNameList();
}
