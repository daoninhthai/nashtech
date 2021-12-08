package com.nashtech.assetmanagementwebservice.controller;
import com.fasterxml.jackson.databind.ObjectMapper;


import com.nashtech.assetmanagementwebservice.config.JwtTokenUtil;
import com.nashtech.assetmanagementwebservice.model.jwt.JwtRequest;
import com.nashtech.assetmanagementwebservice.model.request.ChangePasswordRequest;
import com.nashtech.assetmanagementwebservice.model.request.CreateUserRequest;
import com.nashtech.assetmanagementwebservice.model.request.UpdateUserRequest;
import com.nashtech.assetmanagementwebservice.service.JwtUserDetailsService;

import org.hamcrest.collection.IsCollectionWithSize;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;



import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@TestPropertySource("/application-test.properties")
@ComponentScan(value = {"com.nashtech.assetmanagementwebservice.service", "com.nashtech.assetmanagementwebservice.repository"})
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "/user.sql")
@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
public class UserControllerIntTests {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired
	private UserDetailsService userService;



	@Autowired
	private AuthenticationManager authenticationManager;

	private String token;

	@BeforeEach
	public void setUp() {
		UserDetails user = userService.loadUserByUsername("duongmh");

		if (user != null) {
			this.token = jwtTokenUtil.generateToken(user);
			authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), "duongmh@11111111"));
		}

	}

    @Test
    public void getAllUser() throws Exception {
        JwtRequest request = new JwtRequest();
        request.setUsername("admin");
        request.setPassword("admin@123");
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/admin/users")

                        .header("Authorization", "Bearer " + token)
                        .accept(MediaType.APPLICATION_JSON_VALUE))


                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", IsCollectionWithSize.hasSize(7)));
//                .andExpect(jsonPath("$[*].id").isNotEmpty());
    }



    @ParameterizedTest(name = "Test get user with id {0} found")
    @ValueSource(ints = {3})
    public void getByIdFound(int id) throws Exception {
        JwtRequest request = new JwtRequest();
        request.setUsername("admin");
        request.setPassword("admin@123");
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/v1/admin/users/" + id)

                        .header("Authorization", "Bearer " + token)
                        .accept(MediaType.APPLICATION_JSON_VALUE))


                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.username").value("admin"));
    }


    @Test
    public void updateUserWithAdminAccount() throws Exception {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest();
        updateUserRequest.setAuthority("ADMIN");
        updateUserRequest.setUsername("updateusername");
        JwtRequest request = new JwtRequest();
        request.setUsername("admin");
        request.setPassword("admin@123");
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/v1/admin/users/1")
                        .header("Authorization", "Bearer " + token)
                        .content(asJsonString(updateUserRequest))
                        .contentType(MediaType.APPLICATION_JSON))
                        .andDo(print())

                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.authority").value("ADMIN"))
                        .andExpect(jsonPath("$.username").value("nguyennguyen"));
    }


    @Test
    public void updateUserWithStaffAccount() throws Exception {
        UpdateUserRequest updateUserRequest = new UpdateUserRequest();
        updateUserRequest.setUsername("username updated");
        updateUserRequest.setFirstName("first name updated");
        updateUserRequest.setLastName("last name updated");
        JwtRequest request = new JwtRequest();
        request.setUsername("nguyennguyen");
        request.setPassword("123");
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/v1/admin/users/1")
                        .header("Authorization", "Bearer " + token)
                        .content(asJsonString(updateUserRequest))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isForbidden());

    }



    @Test
    public void createUserWithAdminAccount() throws Exception {
        CreateUserRequest createUserRequest = new CreateUserRequest();

        createUserRequest.setUsername("Dao");

        createUserRequest.setFirstName("Dao");
        createUserRequest.setLastName("Thai");


        JwtRequest request = new JwtRequest();
        request.setUsername("admin");
        request.setPassword("admin@123");
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + token)
                        .content(asJsonString(createUserRequest))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
              .andExpect(status().isOk());
//                .andExpect(jsonPath("$.username").value("daot"))
//                .andExpect(jsonPath("$.firstName").value("Dao"))
//                .andExpect(jsonPath("$.lastName").value("Thai"));
    }

    @Test
    public void createPostWithStaffAccount() throws Exception {
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setUsername("thaid");
        createUserRequest.setFirstName("Dao");
        createUserRequest.setLastName("Thai");
        createUserRequest.setAuthority("STAFF");
        createUserRequest.setStatus("enabled");

        JwtRequest request = new JwtRequest();
        request.setUsername("nguyennguyen");
        request.setPassword("123");
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + token)
                        .content(asJsonString(createUserRequest))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isForbidden());


    }

    @Test
    public void changePassWordWithAdminAccount() throws Exception {
        ChangePasswordRequest updateUserRequest = new ChangePasswordRequest();
        updateUserRequest.setPassword("123");
        JwtRequest request = new JwtRequest();
        request.setUsername("nguyennguyen");
        request.setPassword("123");
        UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(request.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        mockMvc.perform(MockMvcRequestBuilders
                        .put("/api/v1/change-password/1")
                        .header("Authorization", "Bearer " + token)
                        .content(asJsonString(updateUserRequest))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").value("123"));

    }





}
