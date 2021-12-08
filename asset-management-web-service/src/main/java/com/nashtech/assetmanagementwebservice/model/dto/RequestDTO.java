package com.nashtech.assetmanagementwebservice.model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RequestDTO {
    private int id;
    private AssignmentDTO assignmentDTO;
    private String acceptedBy;
    private LocalDate returnedDate;
    private int state;
    private String requestBy;

}
