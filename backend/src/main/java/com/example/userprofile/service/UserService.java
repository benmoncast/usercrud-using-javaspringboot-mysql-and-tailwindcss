package com.example.userprofile.service;

import com.example.userprofile.dto.UserCreateRequest;
import com.example.userprofile.dto.UserResponse;
import com.example.userprofile.dto.UserUpdateRequest;
import java.util.List;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);

    List<UserResponse> searchUsers(String keyword);
}
