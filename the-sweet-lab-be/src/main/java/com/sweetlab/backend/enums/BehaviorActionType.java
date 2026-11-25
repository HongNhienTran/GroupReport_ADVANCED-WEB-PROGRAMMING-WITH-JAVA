package com.sweetlab.backend.enums;

public enum BehaviorActionType {
    VIEW(1),
    SEARCH(1),
    WISHLIST(2),
    ADD_TO_CART(3),
    PURCHASE(5);

    private final int weight;

    BehaviorActionType(int weight) {
        this.weight = weight;
    }

    public int getWeight() {
        return weight;
    }
}
