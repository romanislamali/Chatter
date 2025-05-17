package com.chatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class ChatController {
    @Autowired
    private MessageRepository messageRepo;

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        return messageRepo.save(message);
    }

    @MessageMapping("fetch-all-messages")
    @SendToUser("/queue/all-messages")
    public List<Message> getAllNotifications() {
        return messageRepo.findAll(Sort.by(Sort.Direction.ASC, "timestamp"));
    }
}
