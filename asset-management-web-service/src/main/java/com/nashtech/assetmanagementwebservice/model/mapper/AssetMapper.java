package com.nashtech.assetmanagementwebservice.model.mapper;

import com.nashtech.assetmanagementwebservice.model.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.entity.Asset;
import org.springframework.stereotype.Component;

@Component
public class AssetMapper {
	private final CategoryMapper categoryMapper = new CategoryMapper();
	
	//map from Asset to AssetDTO
	public AssetDTO fromEntity(Asset asset) {
		AssetDTO dto = new AssetDTO();
		dto.setId(asset.getId());
		dto.setAssetCode(asset.getAssetCode());
		dto.setAssetName(asset.getAssetName());
		dto.setSpecification(asset.getSpecification());
		dto.setInstalledDate(asset.getInstalledDate());
		dto.setState(asset.getState());
		dto.setLocation(asset.getLocation());
		dto.setCategoryDTO(categoryMapper.fromEntity(asset.getCategory()));
		return dto;
	}
	
	//map from AssetDTO to Asset
	public Asset fromDTO(AssetDTO payload) {
		Asset asset = new Asset();
		asset.setAssetName(payload.getAssetName());
		asset.setSpecification(payload.getSpecification());
		asset.setInstalledDate(payload.getInstalledDate());
		asset.setState(payload.getState());
		return asset;
	}
			
	//used to update Asset from AssetDTO
	public Asset merge(Asset entity, AssetDTO payload) {
		entity.setAssetName(payload.getAssetName());
		entity.setSpecification(payload.getSpecification());
		entity.setInstalledDate(payload.getInstalledDate());
		entity.setState(payload.getState());
		return entity;
	}
	
}
