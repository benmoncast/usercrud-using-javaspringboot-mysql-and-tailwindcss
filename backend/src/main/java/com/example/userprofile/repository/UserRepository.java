package com.example.userprofile.repository;

import com.example.userprofile.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsernameAndIdNot(String username, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("""
            SELECT u FROM User u
            WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(COALESCE(u.phoneNumber, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(COALESCE(u.role, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(COALESCE(u.status, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
            ORDER BY u.createdAt DESC
            """)
    List<User> searchUsers(@Param("keyword") String keyword);
}
