package com.wellness.repository;

import com.wellness.model.Role;
import com.wellness.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByActiveTrue();
    List<User> findByRole(Role role);
    List<User> findByRoleAndActiveTrue(Role role);
}
