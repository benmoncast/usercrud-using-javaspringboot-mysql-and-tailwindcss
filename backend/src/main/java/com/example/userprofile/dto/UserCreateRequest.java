package com.example.userprofile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserCreateRequest extends UserFormRequest {

    @Override
    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters.")
    public String getPassword() {
        return super.getPassword();
    }
}
