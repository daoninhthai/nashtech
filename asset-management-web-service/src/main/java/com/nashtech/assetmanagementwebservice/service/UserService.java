package com.nashtech.assetmanagementwebservice.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.nashtech.assetmanagementwebservice.entity.User;
import com.nashtech.assetmanagementwebservice.model.dto.UserDTO;
import com.nashtech.assetmanagementwebservice.model.request.ChangePasswordRequest;
import com.nashtech.assetmanagementwebservice.model.request.CreateUserRequest;
import com.nashtech.assetmanagementwebservice.model.request.UpdateUserRequest;

@Service
public interface UserService {
  List<UserDTO> getAllUser();

  UserDTO findByUserName(String username);

  User findUserByUsername(String username);

  UserDTO getUserById(int id);

  UserDTO updateUser(UpdateUserRequest request, int id);

  UserDTO disableUser(UpdateUserRequest request, int id);

  UserDTO createUser(CreateUserRequest request);

  List<UserDTO> searchByNameOrStaffCode(String keyword);

  List<UserDTO> getUsers(String type, String keyword);

  UserDTO changePassword(ChangePasswordRequest request, String username);



}
