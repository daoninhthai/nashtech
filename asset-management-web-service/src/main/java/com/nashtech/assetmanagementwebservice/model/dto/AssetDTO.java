package com.nashtech.assetmanagementwebservice.model.dto;

import java.time.LocalDate;


public class AssetDTO {
	private int id;
	
	private String assetCode;
	
	private String assetName;
	
	private String specification;
	
	private LocalDate installedDate;
	
	private int state;
	
	private String location;
	
	private CategoryDTO categoryDTO;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAssetCode() {
		return assetCode;
	}

	public void setAssetCode(String assetCode) {
		this.assetCode = assetCode;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}

	public String getSpecification() {
		return specification;
	}

	public void setSpecification(String specification) {
		this.specification = specification;
	}

	public LocalDate getInstalledDate() {
		return installedDate;
	}

	public void setInstalledDate(LocalDate installedDate) {
		this.installedDate = installedDate;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public CategoryDTO getCategoryDTO() {
		return categoryDTO;
	}

	public void setCategoryDTO(CategoryDTO categoryDTO) {
		this.categoryDTO = categoryDTO;
	}

	@Override
	public String toString() {
		return "AssetDTO{" +
				"id=" + id +
				", assetCode='" + assetCode + '\'' +
				", assetName='" + assetName + '\'' +
				", specification='" + specification + '\'' +
				", installedDate=" + installedDate +
				", state=" + state +
				", location='" + location + '\'' +
				", categoryDTO=" + categoryDTO +
				'}';
	}
}
