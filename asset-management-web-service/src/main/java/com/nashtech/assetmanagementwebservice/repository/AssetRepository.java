package com.nashtech.assetmanagementwebservice.repository;


import com.nashtech.assetmanagementwebservice.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nashtech.assetmanagementwebservice.entity.Asset;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface AssetRepository extends JpaRepository<Asset, Integer> {
    List<Asset> findAllByOrderByAssetName();
    
    Asset findByAssetCode(String assetCode);
    
    //get the latest id of the asset based on their category prefix
    @Query(value = "SELECT MAX(CONVERT(SUBSTRING_INDEX(a.asset_code,c.prefix,-1), SIGNED)) as maxIdForEachCategory "
            + "FROM asset a inner join category c on a.category_id = c.id "
            + "WHERE c.prefix = :prefix GROUP BY c.prefix",
            nativeQuery = true)
    Integer getAssetMaxId(String prefix);

    //used for searching
    List<Asset> findByAssetNameContainsOrAssetCodeContains(String assetName, String assetCode);

    //used for filtering
    @Query("SELECT a FROM Asset a WHERE a.category.name = :category")
    List<Asset> findAssetByCategory(String category);

    List<Asset> findAssetByState(int state);

    List<Asset> findAssetByStateAndCategory(int state, Category category);

    @Query(value = "select " +
            "  category.name as \"Category\", " +
            "  count(asset.category_id) as \"Total\", " +
            "  sum(case when asset.state = 4 then 1 else 0 end) as \"Assigned\", " +
            "  sum(case when asset.state = 0 then 1 else 0 end) as \"Available\", " +
            "  sum(case when asset.state = 1 then 1 else 0 end) as \"Not Available\", " +
            "  sum(case when asset.state = 2 then 1 else 0 end) as \"Waiting for recycling\", " +
            "  sum(case when asset.state = 3 then 1 else 0 end) as \"Recycled\" " +
            "from category " +
            "left join " +
            " asset " +
            "on category.id = asset.category_id " +
            "group by category.name", nativeQuery = true)
    List<Object[]> getDataForReport();

}
