package com.nashtech.assetmanagementwebservice.model.dto;

import java.time.LocalDate;

public class AssignmentDTO {
	private int id;
	
	private UserDTO userDTO;
	
	private AssetDTO assetDTO;
	
	private String assignedBy;
	
	private LocalDate assignedDate;
	
	private int state;
	
	private String note;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public UserDTO getUserDTO() {
		return userDTO;
	}

	public void setUserDTO(UserDTO userDTO) {
		this.userDTO = userDTO;
	}

	public AssetDTO getAssetDTO() {
		return assetDTO;
	}

	public void setAssetDTO(AssetDTO assetDTO) {
		this.assetDTO = assetDTO;
	}
	
	public String getAssignedBy() {
		return assignedBy;
	}

	public void setAssignedBy(String assignedBy) {
		this.assignedBy = assignedBy;
	}

	public LocalDate getAssignedDate() {
		return assignedDate;
	}

	public void setAssignedDate(LocalDate assignedDate) {
		this.assignedDate = assignedDate;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	@Override
	public String toString() {
		return "AssignmentDTO{" +
				"id=" + id +
				", userDTO=" + userDTO +
				", assetDTO=" + assetDTO +
				", assignedBy='" + assignedBy + '\'' +
				", assignedDate=" + assignedDate +
				", state=" + state +
				", note='" + note + '\'' +
				'}';
	}
}
