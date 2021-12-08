package com.nashtech.assetmanagementwebservice.repository;

import com.nashtech.assetmanagementwebservice.entity.Asset;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@AutoConfigureTestDatabase
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "/add-asset.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "/delete-asset.sql")
public class AssetRepositoryTest {
    @Autowired
    private  AssetRepository assetRepository;

    @Test
    public void testGetAllAssets() {
        List<Asset> posts = assetRepository.findAll();
        Assertions.assertEquals(12, posts.size());
    }

    @Test
    public void findAssetById(){
        Asset asset = assetRepository.getById(1);
        Assertions.assertEquals(1,asset.getId());
        Assertions.assertEquals("Asset Name 1",asset.getAssetName());
    }

}
