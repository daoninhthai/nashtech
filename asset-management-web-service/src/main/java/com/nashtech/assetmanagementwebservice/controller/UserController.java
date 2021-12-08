package com.nashtech.assetmanagementwebservice.controller;

import java.security.Principal;
import java.util.List;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.nashtech.assetmanagementwebservice.model.dto.UserDTO;
import com.nashtech.assetmanagementwebservice.model.request.ChangePasswordRequest;
import com.nashtech.assetmanagementwebservice.model.request.CreateUserRequest;
import com.nashtech.assetmanagementwebservice.model.request.UpdateUserRequest;
import com.nashtech.assetmanagementwebservice.service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;


@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @ApiOperation(value = "Filter By Type of User and Search By name Or staffCode", response = UserDTO.class, responseContainer = "List")
    @GetMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserDTO>> getUsers(@RequestParam(name = "type", required = false) String type, @RequestParam(name = "searchTerm", required = false) String keyword) {
        List<UserDTO> users = userService.getUsers(type, keyword);
        return ResponseEntity.ok(users);
    }

    @ApiOperation(value = "Get user By ID", response = UserDTO.class)
    @ApiResponses({@ApiResponse(code = 404, message = "No user found"), @ApiResponse(code = 500, message = "500")})
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        UserDTO result = userService.getUserById(id);
        return ResponseEntity.ok(result);
    }


    @ApiOperation(value = "Get user By username", response = UserDTO.class)
    @ApiResponses({@ApiResponse(code = 404, message = "No user found"), @ApiResponse(code = 500, message = "500")})
    @GetMapping("/my-info")
    public ResponseEntity<?> getUserByUsername(Principal principal) {
        String username = principal.getName();
        UserDTO result = userService.findByUserName(username);
        return ResponseEntity.ok(result);
    }


    @ApiOperation(value = "Create user", response = UserDTO.class)
    @ApiResponses({@ApiResponse(code = 400, message = "User already exists in the system"), @ApiResponse(code = 500, message = "500")})
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO result = userService.createUser(request);
        return ResponseEntity.ok(result);
    }


    @ApiOperation(value = "Update user", response = UserDTO.class)
    @ApiResponses({@ApiResponse(code = 404, message = "No user found"), @ApiResponse(code = 500, message = "")})
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@Valid @RequestBody UpdateUserRequest request, @PathVariable int id) {
        UserDTO result = userService.updateUser(request, id);
        return ResponseEntity.ok(result);
    }


    @ApiOperation(value = "Change user status", response = UserDTO.class)
    @ApiResponses({@ApiResponse(code = 404, message = "No user found"), @ApiResponse(code = 500, message = "")})
    @PutMapping("/users/status/{id}")
    public ResponseEntity<?> changeUserStatus(@Valid @RequestBody UpdateUserRequest request, @PathVariable int id) {
        UserDTO result = userService.disableUser(request, id);
        return ResponseEntity.ok(result);
    }


    @ApiOperation(value = "Change user password", response = UserDTO.class)
    @ApiResponses({@ApiResponse(code = 404, message = "No user found"), @ApiResponse(code = 500, message = "")})
    @PutMapping("/change-password/{username}")
    public ResponseEntity<?> changeUserPassword(@Valid @RequestBody ChangePasswordRequest request, @PathVariable String username) {
        UserDTO result = userService.changePassword(request, username);
        return ResponseEntity.ok(result);
    }


}
