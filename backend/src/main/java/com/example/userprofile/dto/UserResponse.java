package com.example.userprofile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        @JsonProperty("first_name") String firstName,
        @JsonProperty("middle_name") String middleName,
        @JsonProperty("last_name") String lastName,
        String username,
        String email,
        @JsonProperty("phone_number") String phoneNumber,
        String gender,
        @JsonProperty("birth_date") LocalDate birthDate,
        String address,
        String role,
        @JsonProperty("profile_image_url") String profileImageUrl,
        String status,
        @JsonProperty("email_verified_at") LocalDateTime emailVerifiedAt,
        @JsonProperty("created_at") LocalDateTime createdAt,
        @JsonProperty("updated_at") LocalDateTime updatedAt
) {
}
