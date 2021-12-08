package com.nashtech.assetmanagementwebservice.service;

import java.util.List;
import com.nashtech.assetmanagementwebservice.model.dto.AssetDTO;

public interface AssetService {

  AssetDTO findAssetById(Integer id);

  AssetDTO createAsset(Integer categoryId, AssetDTO payload);

  AssetDTO editAsset(Integer assetId, AssetDTO payload);

  void deleteAssetById(Integer id);

  List<AssetDTO> filterAssets(String category, Integer state, String keyword);

  List<Object[]> getDataForReport();
}
