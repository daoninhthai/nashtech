package com.nashtech.assetmanagementwebservice.controller;

import java.time.LocalDate;
import java.util.List;

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
import com.nashtech.assetmanagementwebservice.model.dto.RequestDTO;
import com.nashtech.assetmanagementwebservice.service.RequestService;
import io.swagger.annotations.ApiOperation;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @ApiOperation(value = "Filter Request", response = RequestDTO.class, responseContainer = "List")
    @GetMapping(value = "/request", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RequestDTO>> filterAsset(@RequestParam(value = "state", required = false) Integer state, @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnedDate, @RequestParam(value = "searchTerm", required = false) String keyword) {
        List<RequestDTO> requests = requestService.filterRequests(state, returnedDate, keyword);
        return ResponseEntity.ok(requests);
    }

    @ApiOperation(value = "Create Returning request")
    @PostMapping(value = "/request/create")
    public ResponseEntity<RequestDTO> create(@RequestBody RequestDTO requestDTO) {
        RequestDTO request = requestService.create(requestDTO);
        return ResponseEntity.ok(request);
    }


    @ApiOperation(value = "Remove Request Using id")
    @DeleteMapping(value = "/request/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> deleteRequest(@PathVariable Integer id) {
        requestService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Mark a Request as Completed", response = RequestDTO.class)
    @PutMapping(value = "/request/{id}/complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RequestDTO> completeRequest(@PathVariable Integer id) {
        RequestDTO assignmentDTO = requestService.complete(id);
        return ResponseEntity.ok(assignmentDTO);
    }
}
