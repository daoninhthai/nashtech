package com.nashtech.assetmanagementwebservice.model.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangePasswordRequest {
    @ApiModelProperty(
            example="thaimeo",
            notes="username cannot be empty",
            required=true
    )
    @JsonProperty("username")
    private String username;
    @ApiModelProperty(
            example="thaimeo",
            notes="Password cannot be empty",
            required=true
    )
    @JsonProperty("password")
    private String password;

}
