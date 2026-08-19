package com.wellness.repository;

import com.wellness.model.Counselor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CounselorRepository extends MongoRepository<Counselor, String> {
    Optional<Counselor> findByUserId(String userId);
    Optional<Counselor> findByEmail(String email);
    List<Counselor> findByActiveTrue();
}
