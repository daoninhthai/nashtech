package com.nashtech.assetmanagementwebservice.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.nashtech.assetmanagementwebservice.model.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.model.dto.CategoryDTO;
import com.nashtech.assetmanagementwebservice.entity.Asset;
import com.nashtech.assetmanagementwebservice.entity.Category;
import com.nashtech.assetmanagementwebservice.exception.NotFoundException;
import com.nashtech.assetmanagementwebservice.model.mapper.AssetMapper;
import com.nashtech.assetmanagementwebservice.model.mapper.CategoryMapper;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.service.impl.AssetServiceImpl;

@ExtendWith(SpringExtension.class)
public class AssetServiceImplTests {
    @Mock
    private AssetRepository assetRepository;
    
    @Mock
    private CategoryService categoryService;

    @Mock
    private AssetMapper assetMapper;
    
    @Mock
    private CategoryMapper categoryMapper;

    @Captor
    private ArgumentCaptor<Asset> captor;

    @InjectMocks
    private AssetServiceImpl underTest;

    private static List<Asset> testList;

    @BeforeAll
    public static void init() {
    	Category firstCategory = new Category(1, "Laptop");
    	Category secondCategory = new Category(2, "Monitor");
        Asset firstAsset = new Asset(1, "Asset 1", "Asset specification", LocalDate.now(), 0, "HN");
        firstAsset.setCategory(firstCategory);
        Asset secondAsset = new Asset(2, "Asset 2", "Asset specification", LocalDate.now(), 1, "HN");
        secondAsset.setCategory(secondCategory);
        testList = new ArrayList<Asset>();
        testList.add(firstAsset);
        testList.add(secondAsset);
    }


    @DisplayName("Test findAssetById() Method")
    @Nested
    public class testFindAssetById {
        @Test
        public void testFindAssetByIdGivenIdNotExistInDatabaseShouldThrowNotFoundException() {
            NotFoundException exception = assertThrows(NotFoundException.class, () -> underTest.findAssetById(1));
            assertEquals("No record found with id 1", exception.getMessage());
        }

        @Test
        public void testFindAssetByIdGivenIdExistInDatabaseShouldReturnDataSuccessfully() {
            when(assetRepository.getById(2)).thenReturn(testList.get(1));
            
            AssetDTO mockPayload = mock(AssetDTO.class);
            when(mockPayload.getId()).thenReturn(2);
            when(mockPayload.getAssetName()).thenReturn(testList.get(1).getAssetName());
            
            AssetDTO asset = underTest.findAssetById(2);
            assertEquals(mockPayload.getId(), asset.getId());
        }
    }


    @DisplayName("Test getAssetList() Method")
    @Nested
    public class testGetAssetList {
        @Test
        public void testGetAssetListGivenAssetExistShouldReturnDataSuccessfully() {
            when(assetRepository.findAllByOrderByAssetName()).thenReturn(testList);
            List<AssetDTO> assets = underTest.filterAssets(null,null,null);
            assertEquals(testList.size(), assets.size());
            assertEquals(testList.get(1).getId(), assets.get(1).getId());
            assertEquals(testList.get(1).getAssetName(), assets.get(1).getAssetName());
            verify(assetRepository).findAllByOrderByAssetName();
        }

        @Test
        public void testGetAssetListGivenNoAssetShouldReturnNoData() {
            when(assetRepository.findAllByOrderByAssetName()).thenReturn(new ArrayList<Asset>());
            List<AssetDTO> noAssets = underTest.filterAssets(null,null,null);
            assertEquals(noAssets.size(), 0);
            verify(assetRepository).findAllByOrderByAssetName();
        }

    }
    
    
    @Nested
	@DisplayName("Test createAsset() Method")
	class TestCreateAsset {
    	@Test
		public void testCreateAssetGivenNullIdShouldThrowException() {
    		AssetDTO mockPayload = mock(AssetDTO.class);
			IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
					() -> underTest.createAsset(null, mockPayload));
			assertEquals("Category id can not be null", exception.getMessage());
		}
    	
		@Test
		public void testCreateAssetGivenNullPayloadShouldThrowException() {
			IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
					() -> underTest.createAsset(1, null));
			assertEquals("Request payload can not be null", exception.getMessage());
		}
		
		@Test
		public void testCreateAssetSuccess() {
			CategoryDTO mockCategory = mock(CategoryDTO.class);
			when(categoryService.findCategoryById(anyInt())).thenReturn(mockCategory);
			when(mockCategory.getId()).thenReturn(1);
			when(mockCategory.getName()).thenReturn("Laptop");
			
			Asset mockAsset = mock(Asset.class);
			when(assetRepository.save(any(Asset.class))).thenReturn(mockAsset);
			
			AssetDTO mockPayload = mock(AssetDTO.class);
			when(mockPayload.getAssetName()).thenReturn("Asset 1");
			when(mockPayload.getId()).thenReturn(1);
			
			assertDoesNotThrow(() -> underTest.createAsset(1, mockPayload));
			verify(assetRepository, times(1)).save(any(Asset.class));
		}
	}


    @DisplayName("Test editAsset() method")
    @Nested
    public class testEditAsset {
        @Test
        public void testEditAssetGivenAssetIdIsNullShouldThrowException(){
            AssetDTO assetDTO = mock(AssetDTO.class);
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> underTest.editAsset(null, assetDTO));
            assertEquals("Asset id can not be null", exception.getMessage());
        }
        
        @Test
        public void testEditAssetGivenAssetPayLoadIsNullShouldBeThrowException(){
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> underTest.editAsset(1,null ));
            assertEquals("Request payload can not be null", exception.getMessage());
        }

        @Test 
        public void testEditAssetSuccess() {
        	Asset testAsset = testList.get(1);
        	when(assetRepository.getById(2)).thenReturn(testAsset);
        	
        	AssetDTO mockPayload = mock(AssetDTO.class);
        	when(mockPayload.getAssetName()).thenReturn("updated Asset name");
            when(mockPayload.getSpecification()).thenReturn("updated Asset specification");
            
            when(assetMapper.merge(testAsset, mockPayload)).thenCallRealMethod();
            when(assetRepository.save(any(Asset.class))).thenReturn(testAsset);
        	
            assertDoesNotThrow(() -> underTest.editAsset(2, mockPayload));
            assertEquals(testAsset.getAssetName(), "updated Asset name");
            assertEquals(testAsset.getLocation(), "HN");
            verify(assetRepository).save(any(Asset.class));
        }
    }
    
    
    @DisplayName("Test deleteAssetById() Method")
    @Nested
    public class testDeleteAssetById {
    	@Test
        public void testDeletePostGivenIdNotFoundShouldThrowNotFoundException() {
            NotFoundException exception = assertThrows(NotFoundException.class, 
            		() -> underTest.deleteAssetById(1));
            assertEquals("No record found with id 1", exception.getMessage());
            verify(assetRepository, never()).delete(any(Asset.class));
        }

        @Test
        public void testDeletePostGivenIdExistShouldDeleteSuccessfully() {
            Asset mockAsset = mock(Asset.class);
            when(mockAsset.getId()).thenReturn(1);
            when(assetRepository.getById(anyInt())).thenReturn(mockAsset);
            underTest.deleteAssetById(1);
            
            verify(assetRepository, times(1)).delete(captor.capture());
            Asset deletedAsset = captor.getValue();
            assertEquals(1, deletedAsset.getId());
        }
    }
}
