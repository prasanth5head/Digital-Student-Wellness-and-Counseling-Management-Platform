package com.wellness.repository;

import com.wellness.model.Notification;
import com.wellness.model.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId, Pageable pageable);
    long countByRecipientIdAndIsReadFalse(String recipientId);
    boolean existsByRecipientIdAndTitleAndType(String recipientId, String title, NotificationType type);
}
