package com.nashtech.assetmanagementwebservice.model.mapper;

import com.nashtech.assetmanagementwebservice.entity.Assignment;
import com.nashtech.assetmanagementwebservice.entity.Authority;
import com.nashtech.assetmanagementwebservice.entity.User;
import com.nashtech.assetmanagementwebservice.model.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.model.dto.UserDTO;
import com.nashtech.assetmanagementwebservice.model.request.ChangePasswordRequest;
import com.nashtech.assetmanagementwebservice.model.request.CreateUserRequest;
import com.nashtech.assetmanagementwebservice.model.request.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {
    private static AssignmentMapper assignmentMapper = new AssignmentMapper();


    public static UserDTO toUserDTO(User user) {
    UserDTO tmp = new UserDTO();
    tmp.setId(user.getId());
    tmp.setUsername(user.getUsername());
    tmp.setFirstName(user.getFirstName());
    tmp.setLastName(user.getLastName());
    tmp.setGender(user.getGender());
    tmp.setJoinedDate(user.getJoinedDate());
    tmp.setDob(user.getDob());
    tmp.setLocation(user.getLocation());
    tmp.setStaffCode(user.getStaffCode());
    tmp.setAuthority(user.getAuthority().getAuthority());
    tmp.setStatus(user.getStatus());
    tmp.setPassword(user.getPassword());
    tmp.setDefaultPassword(user.getDefaultPassword());
    tmp.setFirstLogin(user.getFirstLogin());
      List<AssignmentDTO> assignmentDTO = new ArrayList<>();
      if (user.getAssignments() != null) {
          assignmentDTO = user.getAssignments().stream().filter(assignment -> assignment.getState() != -1).map(assignmentMapper::fromEntityNoUser).collect(Collectors.toList());
      }
      tmp.setAssignments(assignmentDTO);
    return tmp;
  }

  public static User toUser(CreateUserRequest request) {
    User user = new User();

    user.setUsername(request.getUsername());
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setGender(request.getGender());
    user.setDob(request.getDob());
    user.setJoinedDate(request.getJoinedDate());
    user.setLocation(request.getLocation());
    user.setStaffCode(user.getStaffCode());
    user.setStatus(request.getStatus());
    user.setDefaultPassword(request.getDefaultPassword());
    user.setFirstLogin(request.getFirstLogin());
    return user;
  }

  public static User toUser(UpdateUserRequest request, int id) {
    User user = new User();
    user.setId(id);
    user.setUsername(request.getUsername());
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setGender(request.getGender());
    user.setDob(request.getDob());
    user.setJoinedDate(request.getJoinedDate());
    user.setLocation(request.getLocation());
    user.setStaffCode(request.getStaffCode());
    user.setStatus(request.getStatus());

    user.setPassword(request.getPassword());
    return user;
  }

  public static User toUser(ChangePasswordRequest request, String username) {
    User user = new User();
    user.setUsername(username);
    user.setPassword(request.getPassword());

    return user;
  }



  public static User mergeUpdate(UpdateUserRequest request, User user) {
    Integer idInteger = user.getAuthority().getId();
    user.setDob(request.getDob());
    user.setJoinedDate(request.getJoinedDate());
    user.setGender(request.getGender());
    user.setAuthority(new Authority(idInteger, user, request.getAuthority()));
    return user;
  }

  public static User mergeDisable(UpdateUserRequest request, User user) {
    user.setStatus("disabled");;
    return user;
  }

  public static Authority toAuthority(UpdateUserRequest request, int id) {
    Authority authority = new Authority();
    authority.setId(id);
    authority.setAuthority(request.getAuthority());
    authority.setUser(request.getUser());
    return authority;
  }


    public static UserDTO toUserDTONoAssignment(User user) {
        UserDTO tmp = new UserDTO();
        tmp.setId(user.getId());
        tmp.setUsername(user.getUsername());
        tmp.setFirstName(user.getFirstName());
        tmp.setLastName(user.getLastName());
        tmp.setGender(user.getGender());
        tmp.setJoinedDate(user.getJoinedDate());
        tmp.setDob(user.getDob());
        tmp.setLocation(user.getLocation());
        tmp.setStaffCode(user.getStaffCode());
        tmp.setAuthority(user.getAuthority().getAuthority());
        tmp.setStatus(user.getStatus());
        tmp.setPassword(user.getPassword());
        tmp.setDefaultPassword(user.getDefaultPassword());
        return tmp;
    }


}
