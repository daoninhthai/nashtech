package com.nashtech.assetmanagementwebservice.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.nashtech.assetmanagementwebservice.entity.Asset;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.nashtech.assetmanagementwebservice.entity.Assignment;
import com.nashtech.assetmanagementwebservice.entity.Request;
import com.nashtech.assetmanagementwebservice.model.dto.RequestDTO;
import com.nashtech.assetmanagementwebservice.model.mapper.RequestMapper;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.RequestRepository;
import com.nashtech.assetmanagementwebservice.service.RequestService;

@Service
public class RequestServiceImpl implements RequestService {

  private final RequestRepository requestRepository;
  private final RequestMapper requestMapper;
  private final AssignmentRepository assignmentRepository;
  private final AssetRepository assetRepository;

  public RequestServiceImpl(RequestRepository requestRepository, RequestMapper requestMapper, AssignmentRepository assignmentRepository, AssetRepository assetRepository) {
    this.requestRepository = requestRepository;
    this.requestMapper = requestMapper;
    this.assignmentRepository = assignmentRepository;
    this.assetRepository = assetRepository;
  }

  @Override
  public List<RequestDTO> getAllRequest() {
    List<Request> requests = requestRepository.findAll();
    return requests.stream().map(requestMapper::fromEntity).collect(Collectors.toList());
  }

  @Override
  public RequestDTO create(RequestDTO requestDTO) {
    int assignID = requestDTO.getAssignmentDTO().getId();
    Request r = requestRepository.findByAssignment_Id(assignID);
    if (r != null) {
      throw new RuntimeException("Assignment ID exist");
    }

    Request request = new Request();
    request.setAssignment(assignmentRepository.getById(assignID));
    request.setRequestBy(SecurityContextHolder.getContext().getAuthentication().getName());
    requestRepository.save(request);
    return requestMapper.fromEntity(request);
  }

  @Override
  public List<RequestDTO> filterRequests(Integer state, LocalDate returnedDate, String keyword) {
    List<Request> requests = new ArrayList<>();
    if (state == null && returnedDate == null && keyword == null) {
      requests = requestRepository.findAll();
    } else if (state != null && returnedDate == null && keyword == null) {
      requests = requestRepository.findRequestsByState(state);
    } else if (state == null && returnedDate != null && keyword == null) {
      requests = requestRepository.findRequestsByReturnedDate(returnedDate);
    } else if (state != null && returnedDate != null && keyword == null) {
      requests = requestRepository.findRequestsByReturnedDate(returnedDate);
      requests = requests.stream().filter(request -> request.getState() == state).collect(Collectors.toList());
    } else if (state != null && returnedDate != null && keyword != null) {
      requests = requestRepository.findByAssignment_Asset_AssetCodeContainsOrAssignment_Asset_AssetNameContainsOrRequestByContains(keyword, keyword, keyword);
      requests = requests.stream().filter(request -> request.getState() == state && request.getReturnedDate() == returnedDate).collect(Collectors.toList());
    } else if (state == null && returnedDate != null && keyword != null) {
      requests = requestRepository.findByAssignment_Asset_AssetCodeContainsOrAssignment_Asset_AssetNameContainsOrRequestByContains(keyword, keyword, keyword);
      requests = requests.stream().filter(request -> request.getReturnedDate() == returnedDate).collect(Collectors.toList());
    } else if (state == null && returnedDate == null && keyword != null) {
      requests = requestRepository.findByAssignment_Asset_AssetCodeContainsOrAssignment_Asset_AssetNameContainsOrRequestByContains(keyword, keyword, keyword);
    } else if (state != null && returnedDate == null && keyword != null) {
      requests = requestRepository.findByAssignment_Asset_AssetCodeContainsOrAssignment_Asset_AssetNameContainsOrRequestByContains(keyword, keyword, keyword);
      requests = requests.stream().filter(request -> request.getState() == state).collect(Collectors.toList());
    }
    return requests.stream().map(requestMapper::fromEntity).collect(Collectors.toList());
  }

  @Override
  public void deleteById(Integer id) {
    Request request = requestRepository.getById(id);
    Assignment assignment = request.getAssignment();
    assignment.setState(6);
    assignmentRepository.save(assignment);
    requestRepository.delete(request);
  }

  @Override
  public RequestDTO complete(Integer id) {
    Request request = requestRepository.getById(id);
    Assignment assignment = request.getAssignment();
    assignment.setState(-1);
    assignmentRepository.save(assignment);
    Asset asset = assetRepository.getById(assignment.getAsset().getId());
    asset.setState(0);
    assetRepository.save(asset);
    request.setReturnedDate(LocalDate.now());
    request.setAcceptedBy(SecurityContextHolder.getContext().getAuthentication().getName());
    request.setState(1);
    requestRepository.save(request);
    return requestMapper.fromEntity(request);
  }
}
