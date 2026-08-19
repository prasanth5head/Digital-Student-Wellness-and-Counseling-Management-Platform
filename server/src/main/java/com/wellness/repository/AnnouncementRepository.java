package com.wellness.repository;

import com.wellness.model.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    List<Announcement> findByActiveTrueOrderByCreatedAtDesc();
    List<Announcement> findByActiveTrueAndTargetRoleInOrderByCreatedAtDesc(List<String> targetRoles);
}
