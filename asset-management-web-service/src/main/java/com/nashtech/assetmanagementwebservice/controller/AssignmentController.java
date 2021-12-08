package com.nashtech.assetmanagementwebservice.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.nashtech.assetmanagementwebservice.model.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.model.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.service.AssignmentService;
import io.swagger.annotations.ApiOperation;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class AssignmentController {
    private final AssignmentService assignmentService;
    private static final Logger logger = LoggerFactory.getLogger(AssignmentController.class);

    @Autowired
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @ApiOperation(value = "Get All Assignments and Filter", response = AssignmentDTO.class)
    @GetMapping(value = "/assignments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AssignmentDTO>> getAll(@RequestParam(value = "type", required = false) Integer state,
                                                      @RequestParam(value = "date", required = false)
                                                      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate assignedDate,
                                                      @RequestParam(value ="keyword", required = false) String keyword
    ) {
        List<AssignmentDTO> assignments = assignmentService.filter(keyword, state, assignedDate);
        return ResponseEntity.ok(assignments);
    }

    @ApiOperation(value = "Get An Assignment Using id", response = AssignmentDTO.class)
    @GetMapping(value = "/assignments/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AssignmentDTO> getAssignment(@PathVariable Integer id) {
        logger.info("Execute getAssignment() inside AssignmentController");
        AssignmentDTO assignment = assignmentService.findAssignmentById(id);
        logger.info("Executed successful!");
        return ResponseEntity.ok(assignment);
    }

    @ApiOperation(value = "Create A New Assignment", response = AssignmentDTO.class)
    @PostMapping(value = "/assignments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AssignmentDTO> createAssignment(@RequestBody AssignmentDTO payload) {
        logger.info("Execute createAssignment() inside AssignmentController");
        AssignmentDTO result = assignmentService.createAssignment(payload);
        logger.info("Executed successful!");
        return ResponseEntity.ok(result);
    }

    @ApiOperation(value = "Delete assignment", response = AssignmentDTO.class)
    @DeleteMapping(value = "/assignments/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        logger.info("Execute delete() inside AssignmentController");
        assignmentService.delete(id);
        logger.info("Executed successful!");
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Edit assignment", response = AssignmentDTO.class)
    @PutMapping(value = "/assignments/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AssignmentDTO> edit(@PathVariable Integer id, @RequestBody AssignmentDTO payload) {
        AssignmentDTO assignmentDTO = assignmentService.edit(id, payload);
        return ResponseEntity.ok(assignmentDTO);
    }

    @ApiOperation(value = "Edit assignment", response = AssignmentDTO.class)
    @GetMapping(value = "/my-assignments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AssignmentDTO>> findAssignmentByUserName(Principal principal) {
        String username = principal.getName();
        List<AssignmentDTO> assignmentDTO = assignmentService.findAssignmentsByUsername(username);
        return ResponseEntity.ok(assignmentDTO);
    }

}
