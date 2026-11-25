package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.UserBehaviorLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserBehaviorLogRepository extends JpaRepository<UserBehaviorLog, Long> {

    List<UserBehaviorLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<UserBehaviorLog> findByGuestSessionIdOrderByCreatedAtDesc(String guestSessionId, Pageable pageable);

    @Query("""
            SELECT l.product.id
            FROM UserBehaviorLog l
            WHERE l.product IS NOT NULL
            GROUP BY l.product.id
            ORDER BY SUM(l.weight) DESC
            """)
    List<Long> findTopInteractedProductIds(Pageable pageable);
}
