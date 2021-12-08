package com.nashtech.assetmanagementwebservice.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.nashtech.assetmanagementwebservice.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.nashtech.assetmanagementwebservice.entity.Asset;
import com.nashtech.assetmanagementwebservice.entity.Assignment;
import com.nashtech.assetmanagementwebservice.entity.User;
import com.nashtech.assetmanagementwebservice.model.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.model.mapper.AssignmentMapper;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;
import com.nashtech.assetmanagementwebservice.service.AssignmentService;

@Service
@Transactional
public class AssignmentServiceImpl implements AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AssignmentMapper assignmentMapper;
    private final Logger log = LoggerFactory.getLogger(AssignmentServiceImpl.class);

    @Autowired
    public AssignmentServiceImpl(AssignmentRepository assignmentRepository, AssetRepository assetRepository, UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        assignmentMapper = new AssignmentMapper();
    }

    @Override
    public List<AssignmentDTO> getAssignmentList() {
        List<Assignment> assignments = assignmentRepository.findByStateNot(-1);
        return assignments.stream().map(assignmentMapper::fromEntity).collect(Collectors.toList());
    }

    @Override
    public AssignmentDTO findAssignmentById(int id) {
        Assignment assignment = assignmentRepository.getById(id);
        return assignmentMapper.fromEntity(assignment);
    }

    @Override
    public AssignmentDTO createAssignment(AssignmentDTO payload) {
    	//find assignments that has the assigned asset and not yet completed (state != -1)
        Assignment a = assignmentRepository.findByAsset_IdAndStateNot(payload.getAssetDTO().getId(), -1);
        
        if (a != null) {
            throw new BadRequestException("Asset id exist & not complete yet");
        }
//        if (a != null) {
//        	a.stream().forEach(assignment -> {
//        		if (assignment.getState() != -1) {
//        			throw new BadRequestException("Asset id exist & not complete yet");
//        		}
//        	});
//        }
        User user = userRepository.getById(payload.getUserDTO().getId());
        Asset asset = assetRepository.getById(payload.getAssetDTO().getId());
        asset.setState(4);
        assetRepository.save(asset);
        Assignment assignment = assignmentMapper.fromDTO(payload);
        assignment.setAsset(asset);
        assignment.setUser(user);
        assignment.setAssignedBy(payload.getAssignedBy());
        assignmentRepository.save(assignment);
        return assignmentMapper.fromEntity(assignment);
    }

    @Override
    public void delete(Integer id) {
        Assignment assignment = assignmentRepository.getById(id);
        if (assignment.getState() != 7) {
            throw new BadRequestException("Asset is current assigned to someone");
        }
        Asset asset = assetRepository.getById(assignment.getAsset().getId());
        asset.setState(0);
        assetRepository.save(asset);
        assignmentRepository.delete(assignment);
    }

    @Override
    public AssignmentDTO edit(Integer id, AssignmentDTO payload) {
        Assignment oldAssignment = assignmentRepository.getById(id);
        Asset oldAsset = oldAssignment.getAsset();
        User user = oldAssignment.getUser();
        if (oldAsset.getId() != payload.getAssetDTO().getId()) {
            oldAsset.setState(0);
            assetRepository.save(oldAsset);
            Asset newAsset = assetRepository.getById(payload.getAssetDTO().getId());
            newAsset.setState(4);
            assetRepository.save(newAsset);
            oldAssignment.setAsset(newAsset);
        }
        if (!Objects.equals(user.getId(), payload.getUserDTO().getId())) {
            User newUser = userRepository.getById(payload.getUserDTO().getId());
            oldAssignment.setUser(newUser);
        }
        log.info(payload.getAssetDTO().getId() + " " + payload.getUserDTO().getId() + " " + id);
        Assignment newAssignment = assignmentMapper.merge(payload, oldAssignment);
        assignmentRepository.save(newAssignment);
        return assignmentMapper.fromEntity(newAssignment);
    }

    @Override
    public List<AssignmentDTO> findAssignmentsByUsername(String username) {
        List<Assignment> assignments = assignmentRepository.findByUser_UsernameAndStateNotAndStateNot(username, -1,7);
        return assignments.stream().map(assignmentMapper::fromEntity).collect(Collectors.toList());
    }


    @Override
    public List<AssignmentDTO> filter(String keyword, Integer state, LocalDate date) {
        List<Assignment> assignments = assignmentRepository.get(keyword,state,date);
        return assignments.stream().map(assignmentMapper::fromEntity).collect(Collectors.toList());
    }


}
