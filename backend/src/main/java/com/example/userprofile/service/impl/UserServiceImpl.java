package com.example.userprofile.service.impl;

import com.example.userprofile.dto.UserCreateRequest;
import com.example.userprofile.dto.UserFormRequest;
import com.example.userprofile.dto.UserResponse;
import com.example.userprofile.dto.UserUpdateRequest;
import com.example.userprofile.entity.User;
import com.example.userprofile.exception.DuplicateResourceException;
import com.example.userprofile.exception.FileStorageException;
import com.example.userprofile.exception.ResourceNotFoundException;
import com.example.userprofile.repository.UserRepository;
import com.example.userprofile.service.UserService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Path PROFILE_IMAGE_UPLOAD_DIR = Path.of(
            "src", "main", "resources", "static", "uploads", "profile_images"
    );

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        checkDuplicateUsername(request.getUsername(), null);
        checkDuplicateEmail(request.getEmail(), null);
        requireProfileImage(request.getProfileImage());

        String imageUrl = storeProfileImage(request.getProfileImage());
        User user = new User();
        applyFormValues(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProfileImageUrl(imageUrl);

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return toResponse(findUser(id));
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = findUser(id);
        checkDuplicateUsername(request.getUsername(), id);
        checkDuplicateEmail(request.getEmail(), id);

        String oldImageUrl = user.getProfileImageUrl();
        MultipartFile newImage = request.getProfileImage();

        applyFormValues(user, request);

        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (newImage != null && !newImage.isEmpty()) {
            user.setProfileImageUrl(storeProfileImage(newImage));
        }

        User savedUser = userRepository.save(user);

        if (newImage != null && !newImage.isEmpty()) {
            deleteProfileImage(oldImageUrl);
        }

        return toResponse(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = findUser(id);
        userRepository.delete(user);
        userRepository.flush();
        deleteProfileImage(user.getProfileImageUrl());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return getAllUsers();
        }

        return userRepository.searchUsers(keyword.trim()).stream()
                .map(this::toResponse)
                .toList();
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " was not found."));
    }

    private void applyFormValues(User user, UserFormRequest request) {
        user.setFirstName(cleanRequired(request.getFirstName()));
        user.setMiddleName(cleanOptional(request.getMiddleName()));
        user.setLastName(cleanRequired(request.getLastName()));
        user.setUsername(cleanRequired(request.getUsername()));
        user.setEmail(cleanRequired(request.getEmail()).toLowerCase(Locale.ROOT));
        user.setPhoneNumber(cleanOptional(request.getPhoneNumber()));
        user.setGender(cleanOptional(request.getGender()));
        user.setBirthDate(request.getBirthDate());
        user.setAddress(cleanOptional(request.getAddress()));
        user.setRole(defaultIfBlank(request.getRole(), "user"));
        user.setStatus(defaultIfBlank(request.getStatus(), "active"));
        user.setEmailVerifiedAt(request.getEmailVerifiedAt());
    }

    private void checkDuplicateUsername(String username, Long currentUserId) {
        String cleanedUsername = cleanRequired(username);
        boolean exists = currentUserId == null
                ? userRepository.existsByUsername(cleanedUsername)
                : userRepository.existsByUsernameAndIdNot(cleanedUsername, currentUserId);

        if (exists) {
            throw new DuplicateResourceException("Username is already taken.");
        }
    }

    private void checkDuplicateEmail(String email, Long currentUserId) {
        String cleanedEmail = cleanRequired(email).toLowerCase(Locale.ROOT);
        boolean exists = currentUserId == null
                ? userRepository.existsByEmail(cleanedEmail)
                : userRepository.existsByEmailAndIdNot(cleanedEmail, currentUserId);

        if (exists) {
            throw new DuplicateResourceException("Email is already registered.");
        }
    }

    private void requireProfileImage(MultipartFile profileImage) {
        if (profileImage == null || profileImage.isEmpty()) {
            throw new IllegalArgumentException("Profile image is required.");
        }
    }

    private String storeProfileImage(MultipartFile profileImage) {
        validateImage(profileImage);

        try {
            Path uploadDir = getUploadDirectory();
            String originalName = StringUtils.cleanPath(
                    profileImage.getOriginalFilename() == null ? "profile-image" : profileImage.getOriginalFilename()
            );
            String extension = StringUtils.getFilenameExtension(originalName);
            String filename = UUID.randomUUID()
                    + (StringUtils.hasText(extension) ? "." + extension.toLowerCase(Locale.ROOT) : "");
            Path target = uploadDir.resolve(filename).normalize();

            if (!target.startsWith(uploadDir)) {
                throw new FileStorageException("Invalid image filename.");
            }

            Files.copy(profileImage.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/profile_images/" + filename;
        } catch (IOException exception) {
            throw new FileStorageException("Could not store the profile image.", exception);
        }
    }

    private void validateImage(MultipartFile profileImage) {
        String contentType = profileImage.getContentType();

        if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            throw new FileStorageException("Only image uploads are allowed.");
        }
    }

    private void deleteProfileImage(String profileImageUrl) {
        if (!StringUtils.hasText(profileImageUrl) || !profileImageUrl.startsWith("/uploads/profile_images/")) {
            return;
        }

        try {
            Path uploadDir = getUploadDirectory();
            String filename = StringUtils.getFilename(profileImageUrl);

            if (!StringUtils.hasText(filename)) {
                return;
            }

            Path file = uploadDir.resolve(filename).normalize();

            if (file.startsWith(uploadDir)) {
                Files.deleteIfExists(file);
            }
        } catch (IOException exception) {
            throw new FileStorageException("Could not delete the profile image.", exception);
        }
    }

    private Path getUploadDirectory() throws IOException {
        Path uploadDir = PROFILE_IMAGE_UPLOAD_DIR.toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);
        return uploadDir;
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getGender(),
                user.getBirthDate(),
                user.getAddress(),
                user.getRole(),
                user.getProfileImageUrl(),
                user.getStatus(),
                user.getEmailVerifiedAt(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    private String cleanRequired(String value) {
        return value == null ? "" : value.trim();
    }

    private String cleanOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private String defaultIfBlank(String value, String fallback) {
        return StringUtils.hasText(value) ? value.trim().toLowerCase(Locale.ROOT) : fallback;
    }
}
