package com.nashtech.assetmanagementwebservice.model.request;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.nashtech.assetmanagementwebservice.entity.Authority;
import com.nashtech.assetmanagementwebservice.entity.User;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateUserRequest {
//    @NotNull(message = "Username is required")
//    @NotEmpty(message = "Username is required")
    @ApiModelProperty(
            example="thaimeo1",
            notes="Username cannot be empty",
            required=true
    )
    @JsonProperty("username")
    private String username;



    @ApiModelProperty(
            example="123",
            notes="",
            required=true
    )
    @JsonProperty("password")
    private String password;



//    @NotNull(message = "First name is required")
//    @NotEmpty(message = "First name is required")
    @ApiModelProperty(
            example="Da1",
            notes="First name cannot be empty",
            required=true
    )
    @JsonProperty("first_name")
    private String  firstName;

//    @NotNull(message = "Last name is required")
//    @NotEmpty(message = "Last name is required")
    @ApiModelProperty(
            example="Th1",
            notes="Last name cannot be empty",
            required=true
    )
    @JsonProperty("last_name")
    private String lastName;

 //   @NotNull(message = "Gender is required")
 //   @NotEmpty(message = "Gender  is required")
    @ApiModelProperty(
            example="male",
            notes="Gender cannot be empty , 1-Male , 2-Female",
            required=true
    )
    @JsonProperty("gender")
    private String gender;


    //   @NotNull(message = "Gender is required")
    //   @NotEmpty(message = "Gender  is required")
//    @ApiModelProperty(
//            example="user",
//            notes="Type cannot be empty , 1-Admin , 2-User",
//            required=true
//    )
//    @JsonProperty("type")
//    private String type;






    @ApiModelProperty(
            example="enable",
            notes="Status cannot be empty , 1-Enable , 2-Disable",
            required=true
    )
    @JsonProperty("status")
    private String status;

//    @NotNull(message = " Date Of Birth is required")
 //   @NotEmpty(message = "Date Of Birth is required")
    @ApiModelProperty(
            example="1999-06-02T21:33:45.249967",
            notes="Birth Date  cannot be empty",
            required=true
    )
    @JsonProperty("dob")
    private LocalDate dob;

//    @NotNull(message = "Staff Code is required")
 //   @NotEmpty(message = "Staff Code is required")
    @ApiModelProperty(
            example="NV1234",
            notes="Staff Code cannot be empty",
            required=true
    )
    @JsonProperty("staff_code")
    private String staffCode;

//    @NotNull(message = "Joined  Date is required")

    @ApiModelProperty(
            example="1999-06-02T21:33:45.249967",
            notes="Joined Date  cannot be empty",
            required=true
    )
    @JsonProperty("joined_date")
    private LocalDate joinedDate;

//    @NotNull(message = "Location is required")
  //  @NotEmpty(message = "Location is required")
    @ApiModelProperty(
            example="HN",
            notes="Location cannot be empty",
            required=true
    )
    @JsonProperty("location")
    private String location;


    @ApiModelProperty(
            example="user",
            notes="Gender cannot be empty , 1-ADMIN , 2-STAFF",
            required=true
    )
    @JsonProperty("authority")
    private String authority;


    @ApiModelProperty(
            example="user",
            notes="Gender cannot be empty , 1-ADMIN , 2-STAFF",
            required=true
    )
    @JsonProperty("user_id")
    private User user;





}
