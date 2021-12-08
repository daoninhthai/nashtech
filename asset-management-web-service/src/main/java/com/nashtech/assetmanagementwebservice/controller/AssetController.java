package com.nashtech.assetmanagementwebservice.controller;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.nashtech.assetmanagementwebservice.service.AssetService;
import io.swagger.annotations.ApiOperation;


@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class AssetController {
  private final AssetService assetService;
  private static final Logger logger = LoggerFactory.getLogger(AssetController.class);

  @Autowired
  public AssetController(AssetService assetService) {
    this.assetService = assetService;
  }


  @ApiOperation(value = "Get An Asset Using id", response = AssetDTO.class)
  @GetMapping(value = "/assets/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<AssetDTO> getAsset(@PathVariable Integer id) {
    logger.info("Execute getAsset() inside AssetController");
    AssetDTO asset = assetService.findAssetById(id);
    logger.info("Executed successful!");
    return ResponseEntity.ok(asset);
  }

  @ApiOperation(value = "Create A New Asset", response = AssetDTO.class)
  @PostMapping(value = "/assets", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<AssetDTO> createAsset(@RequestBody AssetDTO payload) {
    logger.info("Execute createAsset() inside AssetController");
    AssetDTO result = assetService.createAsset(payload.getCategoryDTO().getId(), payload);
    logger.info("Executed successful!");
    return ResponseEntity.ok(result);
  }

  @ApiOperation(value = "Update An Asset Using id", response = AssetDTO.class)
  @PutMapping(value = "/assets/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<AssetDTO> updateAsset(@PathVariable Integer id, @RequestBody AssetDTO payload) {
    logger.info("Execute updateAsset() inside AssetController");
    AssetDTO asset = assetService.editAsset(id, payload);
    logger.info("Executed successful!");
    return ResponseEntity.ok(asset);
  }

  @ApiOperation(value = "Delete An Asset Using id")
  @DeleteMapping(value = "/assets/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Void> deleteAsset(@PathVariable Integer id) {
    logger.info("Execute deleteAsset() inside AssetController");
    assetService.deleteAssetById(id);
    logger.info("Executed successful!");
    return ResponseEntity.ok().build();
  }

  @ApiOperation(value = "Get All Asset and Filter Asset", response = AssetDTO.class, responseContainer = "List")
  @GetMapping(value = "/assets", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<AssetDTO>> getAll(@RequestParam(value = "category", required = false) String category
          , @RequestParam(value = "type", required = false) Integer state
          , @RequestParam(value = "searchTerm", required = false) String keyword) {
    List<AssetDTO> assets = assetService.filterAssets(category, state, keyword);
    return ResponseEntity.ok(assets);
  }

  @ApiOperation(value = "Report", response = Object.class, responseContainer = "List")
  @GetMapping(value = "/assets/report", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<Object[]>> getDataForReport() {
    List<Object[]> result = assetService.getDataForReport();
    return ResponseEntity.ok(result);

  }
}
