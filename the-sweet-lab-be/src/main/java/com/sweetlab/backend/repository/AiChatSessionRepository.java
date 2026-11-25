package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.AiChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiChatSessionRepository extends JpaRepository<AiChatSession, Long> {
    List<AiChatSession> findByUserIdOrderByStartedAtDesc(Long userId);
}
