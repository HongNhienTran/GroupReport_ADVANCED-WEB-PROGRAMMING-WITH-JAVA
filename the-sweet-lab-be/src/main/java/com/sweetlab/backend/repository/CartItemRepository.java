package com.sweetlab.backend.repository;

import com.sweetlab.backend.entity.CartItem;
import com.sweetlab.backend.entity.CartItemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, CartItemId> {
}
