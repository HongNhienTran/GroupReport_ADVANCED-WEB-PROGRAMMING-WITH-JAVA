package com.thesweetlabbe.modules.user.dto;

import com.thesweetlabbe.modules.user.enums.AddressType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAddressDTO {
    private UUID id;
    private String recipientName;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String detailAddress;
    private String fullAddress;
    private AddressType addressType;
    private boolean isDefault;
}
