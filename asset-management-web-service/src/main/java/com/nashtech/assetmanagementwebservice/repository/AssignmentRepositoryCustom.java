package com.nashtech.assetmanagementwebservice.repository;

import com.nashtech.assetmanagementwebservice.entity.Assignment;

import java.time.LocalDate;
import java.util.List;

public interface AssignmentRepositoryCustom {
    List<Assignment> get(String keyword, Integer state, LocalDate date);
}
