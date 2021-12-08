package com.nashtech.assetmanagementwebservice.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.nashtech.assetmanagementwebservice.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.nashtech.assetmanagementwebservice.entity.Asset;
import com.nashtech.assetmanagementwebservice.entity.Category;
import com.nashtech.assetmanagementwebservice.entity.User;
import com.nashtech.assetmanagementwebservice.model.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.model.mapper.AssetMapper;
import com.nashtech.assetmanagementwebservice.model.mapper.CategoryMapper;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.service.AssetService;
import com.nashtech.assetmanagementwebservice.service.CategoryService;
import com.nashtech.assetmanagementwebservice.service.UserService;

@Service
@Transactional
public class AssetServiceImpl implements AssetService {
    private final AssetRepository assetRepository;
    private final CategoryService categoryService;
    private final UserService userService;
    private final AssetMapper assetMapper;
    private final CategoryMapper categoryMapper;
    private static final Logger logger = LoggerFactory.getLogger(AssetServiceImpl.class);

    @Autowired
    public AssetServiceImpl(AssetRepository assetRepository, CategoryService categoryService, UserService userService) {
        this.assetRepository = assetRepository;
        this.categoryService = categoryService;
        this.userService = userService;
        assetMapper = new AssetMapper();
        categoryMapper = new CategoryMapper();
    }

    @Override
    public AssetDTO findAssetById(Integer id) {
        logger.info("Attempting to find Asset with id " + id + "...");
        Asset asset = assetRepository.getById(id);
        logger.info("Successfully found an Asset with id=" + asset.getId() + ",title=" + asset.getAssetCode() + ",assetName=" + asset.getAssetName() + ",category=" + asset.getCategory().getName() + "!");
        return assetMapper.fromEntity(asset);
    }

    @Override
    public AssetDTO createAsset(Integer categoryId, AssetDTO payload) {
        logger.info("Attempting to create new Asset...");
        if (categoryId == null) {
            throw new BadRequestException("Category id can not be null");
        }
        Asset asset = assetMapper.fromDTO(payload);
        // 0 Available, 1 Not Available, 2 Waiting for recycling, 3 Recycled, 4 Assigned, 5 Waiting for acceptance, 6 Accepted
        if (asset.getState() > 1) {
            throw new BadRequestException("Option is not available");
        }
        String location = getCurrentLoggedInUserLocation();
        asset.setLocation(location);
        Category category = categoryMapper.fromDTO(categoryService.findCategoryById(categoryId));
        asset.setCategory(category);
        String assetCode = generateAssetCode(category);
        asset.setAssetCode(assetCode);

        assetRepository.save(asset);
        logger.info("Successfully created an Asset with id=" + asset.getId() + ",title=" + asset.getAssetCode() + ",assetName=" + asset.getAssetName() + ",category=" + asset.getCategory().getName() + "!");
        return assetMapper.fromEntity(asset);
    }

    @Override
    public AssetDTO editAsset(Integer assetId, AssetDTO payload) {
        logger.info("Attempting to update Asset with id " + assetId + "...");
        if (assetId == null) {
            throw new BadRequestException("Asset id can not be null");
        }
        Asset asset = assetRepository.getById(assetId);
        Asset assetEdit = assetMapper.merge(asset, payload);
        //set location based on current logged in user (admin)
        asset.setLocation(getCurrentLoggedInUserLocation());
        Asset assetResult = assetRepository.save(assetEdit);
        logger.info("Successfully updated an Asset with id=" + asset.getId() + ",title=" + assetResult.getAssetCode() + ",assetName=" + assetResult.getAssetName() + ",category=" + assetResult.getCategory().getName() + "!");
        return assetMapper.fromEntity(assetResult);
    }

    @Override
    public void deleteAssetById(Integer id) {
        logger.info("Attempting to delete Asset with id " + id + "...");
        Asset asset = assetRepository.getById(id);
        // 4 Assigned => can not delete
        if (asset.getState() == 4) {
            throw new BadRequestException("Asset is currently assigned to someone");
        }
        logger.info("Successfully delete an Asset with id=" + asset.getId() + "!");
        assetRepository.delete(asset);
    }


    @Override
    public List<AssetDTO> filterAssets(String category, Integer state, String keyword) {
    	String currentUserLocation = getCurrentLoggedInUserLocation();
        List<Asset> assets = new ArrayList<>();
        if (state == null && category == null && keyword == null) {
            assets = assetRepository.findAllByOrderByAssetName();
        } else if (state == null && category != null && keyword == null) {
            assets = assetRepository.findAssetByCategory(category);
        } else if (category == null && state != null && keyword == null) {
            assets = assetRepository.findAssetByState(state);
        } else if (category != null && state != null && keyword == null) {
            assets = assetRepository.findAssetByState(state);
            assets = assets.stream().filter(asset -> asset.getCategory().getName().equals(category)).collect(Collectors.toList());
        } else if (state == null && category == null && keyword != null) {
            assets = assetRepository.findByAssetNameContainsOrAssetCodeContains(keyword, keyword);
        } else if (state == null && category != null && keyword != null) {
            assets = assetRepository.findByAssetNameContainsOrAssetCodeContains(keyword, keyword);
            assets = assets.stream().filter(asset -> asset.getCategory().getName().equals(category)).collect(Collectors.toList());
        } else if (category == null && state != null && keyword != null) {
            assets = assetRepository.findByAssetNameContainsOrAssetCodeContains(keyword, keyword);
            assets = assets.stream().filter(asset -> asset.getState() == state).collect(Collectors.toList());
        } else if (category != null && state != null && keyword != null) {
            assets = assetRepository.findByAssetNameContainsOrAssetCodeContains(keyword, keyword);
            assets = assets.stream()
                    .filter(asset -> asset.getState() == state && asset.getCategory().getName().equals(category))
                    .collect(Collectors.toList());
        }
        logger.info("Successfully got " + assets.size() + " Asset!");
        return assets.stream()
        		.filter(asset -> asset.getLocation().equals(currentUserLocation))
        		.map(assetMapper::fromEntity)
        		.collect(Collectors.toList());
    }
    
    @Override
    public List<Object[]> getDataForReport() {
        List<Object[]> result = assetRepository.getDataForReport();
        for (Object[] record : result) {
            String category = String.valueOf(record[0]);
            Number total = (Number) record[1];
            Number assigned = (Number) record[2];
            Number available = (Number) record[3];
            Number notAvailable = (Number) record[4];
            Number waitingForRecycling = (Number) record[5];
            Number recycled = (Number) record[6];
            record[0] = category;
            record[1] = total;
            record[2] = assigned;
            record[3] = available;
            record[4] = notAvailable;
            record[5] = waitingForRecycling;
            record[6] = recycled;
        }
        return result;
    }


    /**
     * generate assetCode for Asset (Example format: Laptop -> LA000001, Monitor: MO000001, Personal Computer: PC000001)
     *
     * @param category
     * @return String
     */
    private String generateAssetCode(Category category) {
        String prefix = category.getPrefix();
        Integer maxId = assetRepository.getAssetMaxId(prefix);

        String assetCode = "";
        if (maxId == null) {
            assetCode = prefix + String.format("%06d", 1);
        } else {
            assetCode = prefix + String.format("%06d", maxId + 1);
        }
        return assetCode;
    }

    /**
     * get location of current logged in user for asset
     * @return String
     */
    private String getCurrentLoggedInUserLocation() {
    	User user = userService.findUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return user.getLocation();
    }

}
