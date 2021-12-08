package com.nashtech.assetmanagementwebservice.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.nashtech.assetmanagementwebservice.entity.Request;

public interface RequestRepository extends JpaRepository<Request, Integer> {

  Request findByAssignment_Id(Integer id);

  
  List<Request> findByAssignment_Asset_AssetCodeContainsOrAssignment_Asset_AssetNameContainsOrRequestByContains(String assetCode, String assetName, String username);
  
  List<Request> findRequestsByState(Integer state);

  List<Request> findRequestsByReturnedDate(LocalDate returnedDate);
}
