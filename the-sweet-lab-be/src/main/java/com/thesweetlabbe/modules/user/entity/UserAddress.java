package com.thesweetlabbe.modules.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.thesweetlabbe.modules.user.enums.AddressType;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "user_addresses", indexes = {
        @Index(name = "idx_user_address_user", columnList = "user_id"),
        @Index(name = "idx_user_address_default", columnList = "is_default")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "province", length = 100)
    private String province;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "ward", length = 100)
    private String ward;

    @Column(name = "detail_address", nullable = false, length = 255)
    private String detailAddress;

    @Column(name = "full_address", length = 500)
    private String fullAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "address_type", length = 20)
    @Builder.Default
    private AddressType addressType = AddressType.HOME;

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private boolean isDefault = false;
}
