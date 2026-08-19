package com.wellness.controller;

import com.wellness.dto.ApiResponse;
import com.wellness.dto.ChatMessageDTO;
import com.wellness.model.Message;
import com.wellness.security.UserDetailsImpl;
import com.wellness.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final ChatService chatService;

    public MessageController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Message>> sendMessage(
            @Valid @RequestBody ChatMessageDTO dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Message message = chatService.sendMessage(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Message sent", message));
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<ApiResponse<List<Message>>> getConversation(@PathVariable String conversationId) {
        List<Message> messages = chatService.getConversationHistory(conversationId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @GetMapping("/with/{userId}")
    public ResponseEntity<ApiResponse<List<Message>>> getConversationWith(
            @PathVariable String userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Message> messages = chatService.getConversationBetweenUsers(userDetails.getId(), userId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PutMapping("/conversation/{conversationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        chatService.markMessagesAsRead(conversationId, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Messages marked as read", null));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        long count = chatService.getUnreadCount(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(count));
    }

    @MessageMapping("/chat.send")
    public void handleStompMessage(@Payload ChatMessageDTO dto,
                                   @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails != null) {
            chatService.sendMessage(userDetails.getId(), dto);
        }
    }
}
