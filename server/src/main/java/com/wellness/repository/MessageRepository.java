package com.wellness.repository;

import com.wellness.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationIdOrderByTimestampAsc(String conversationId);
    List<Message> findByRecipientIdAndIsReadFalse(String recipientId);
    long countByRecipientIdAndIsReadFalse(String recipientId);
    long countByConversationIdAndRecipientIdAndIsReadFalse(String conversationId, String recipientId);
}
