package com.nashtech.assetmanagementwebservice.service;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import com.nashtech.assetmanagementwebservice.exception.DuplicateRecordException;
import org.assertj.core.util.Arrays;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.nashtech.assetmanagementwebservice.entity.Category;
import com.nashtech.assetmanagementwebservice.exception.NotFoundException;
import com.nashtech.assetmanagementwebservice.model.dto.CategoryDTO;
import com.nashtech.assetmanagementwebservice.model.mapper.CategoryMapper;
import com.nashtech.assetmanagementwebservice.repository.CategoryRepository;
import com.nashtech.assetmanagementwebservice.service.impl.CategoryServiceImpl;

@ExtendWith(SpringExtension.class)
public class CategoryServiceImplTests {
	@Mock
	private CategoryRepository categoryRepository;
	
	@Mock
	private CategoryMapper categoryMapper;
	
	@InjectMocks
	private CategoryServiceImpl underTest;
	
	private static List<Category> testList;
	
	@BeforeAll
    public static void init() {
    	Category first = new Category(1,"LA", "Laptop");
    	Category second = new Category(2, "MO", "Monitor");
        testList = new ArrayList<Category>();
        testList.add(first);
        testList.add(second);
    }
	
	
	@DisplayName("Test getCategoryList() Method")
    @Nested
    public class testGetCategoryList {
        @Test
        public void testGetCategoryListGivenCategoryExistShouldReturnDataSuccessfully() {
            when(categoryRepository.findAll()).thenReturn(testList);
            List<CategoryDTO> assets = underTest.getCategoryList();
            assertEquals(testList.size(), assets.size());
            assertEquals(testList.get(1).getId(), assets.get(1).getId());
            assertEquals(testList.get(1).getPrefix(), assets.get(1).getPrefix());
            verify(categoryRepository).findAll();
        }

        @Test
        public void testGetCategoryListGivenNoCategoryShouldReturnNoData() {
            when(categoryRepository.findAll()).thenReturn(new ArrayList<Category>());
            List<CategoryDTO> noAssets = underTest.getCategoryList();
            assertEquals(noAssets.size(), 0);
            verify(categoryRepository).findAll();
        }
    }
	
	
	@DisplayName("Test findCategoryById() Method")
	@Nested
	public class testFindCategoryById {
		@Test
		public void testFindCategoryByIdGivenIdNotExistShouldThrowException() {
			NotFoundException exception = assertThrows(NotFoundException.class, 
					() -> underTest.findCategoryById(2));
			assertEquals("No record found with id 2", exception.getMessage());
		}
		
		@Test
		public void testFindCategoryByIdGivenIdExistShouldReturnDataSuccessfully() {
			when(categoryRepository.getById(1)).thenReturn(testList.get(0));
			
			CategoryDTO mockCategory = mock(CategoryDTO.class);
			when(mockCategory.getId()).thenReturn(testList.get(0).getId());
			when(mockCategory.getName()).thenReturn(testList.get(0).getName());
			
			assertEquals(mockCategory.getId(), 1);
			assertEquals(mockCategory.getName(), "Laptop");
		}
	}
	
	
	@Nested
	@DisplayName("Test createCategory() Method")
	class TestCreateCategory {
    	@Test
		public void testCreateCategoryGivenDuplicatedPrefixShouldThrowException() {
    		CategoryDTO mockPayload = mock(CategoryDTO.class);
    		when(mockPayload.getPrefix()).thenReturn("LA");
    		
    		List prefixes = Arrays.asList(new String[] {"LA", "MO"});
			when(categoryRepository.getPrefixList()).thenReturn(prefixes);
			assertTrue(prefixes.contains(mockPayload.getPrefix()));
			DuplicateRecordException exception = assertThrows(DuplicateRecordException.class,
					() -> underTest.createCategory(mockPayload));
			assertEquals("Prefix must be unique", exception.getMessage());
		}
    	
		@Test
		public void testCreateCategoryGivenDuplicatedNameShouldThrowException() {
			CategoryDTO mockPayload = mock(CategoryDTO.class);
			when(mockPayload.getName()).thenReturn("Laptop");
			
			List names = Arrays.asList(new String[] {"Laptop", "Monitor"});
			when(categoryRepository.getNameList()).thenReturn(names);
			assertTrue(names.contains(mockPayload.getName()));
			DuplicateRecordException exception = assertThrows(DuplicateRecordException.class, 
					() -> underTest.createCategory(mockPayload));
			assertEquals("Name must be unique", exception.getMessage());
		}
		
		@Test
		public void testCreateCategorySuccess() {
			CategoryDTO mockPayload = mock(CategoryDTO.class);
			when(mockPayload.getId()).thenReturn(3);
			when(mockPayload.getPrefix()).thenReturn("PC");
			when(mockPayload.getName()).thenReturn("Personal Computer");
			
			Category mockCategory = mock(Category.class);
			when(categoryMapper.fromDTO(mockPayload)).thenCallRealMethod();
			when(categoryRepository.save(any(Category.class))).thenReturn(mockCategory);
			
			assertDoesNotThrow(() -> underTest.createCategory(mockPayload));
			verify(categoryRepository, times(1)).save(any(Category.class));
		}
	}
}
