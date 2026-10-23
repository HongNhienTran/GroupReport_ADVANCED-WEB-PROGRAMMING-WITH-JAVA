package com.thesweetlabbe.service.impl;

import com.thesweetlabbe.enums.ErrorCode;
import com.thesweetlabbe.exception.AppException;
import com.thesweetlabbe.dto.NutritionProfileDTO;
import com.thesweetlabbe.dto.UserDTO;
import com.thesweetlabbe.dto.UserProfileDTO;
import com.thesweetlabbe.entity.NutritionProfile;
import com.thesweetlabbe.entity.User;
import com.thesweetlabbe.entity.UserProfile;
import com.thesweetlabbe.repository.UserRepository;
import com.thesweetlabbe.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserProfile(UUID userId) {
        User user = userRepository.findWithProfilesById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return mapToDTO(user);
    }

    @Override
    public UserDTO mapToDTO(User user) {
        if (user == null) return null;

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .profile(mapProfileToDTO(user.getProfile()))
                .nutritionProfile(mapNutritionToDTO(user.getNutritionProfile()))
                .addresses(mapAddressesToDTO(user.getAddresses()))
                .build();
    }

    @Override
    public UserProfileDTO mapProfileToDTO(UserProfile profile) {
        if (profile == null) return null;
        return UserProfileDTO.builder()
                .phone(profile.getPhone())
                .avatar(profile.getAvatar())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .build();
    }

    @Override
    public NutritionProfileDTO mapNutritionToDTO(NutritionProfile nutritionProfile) {
        if (nutritionProfile == null) return null;
        return NutritionProfileDTO.builder()
                .height(nutritionProfile.getHeight())
                .weight(nutritionProfile.getWeight())
                .activityLevel(nutritionProfile.getActivityLevel())
                .goal(nutritionProfile.getGoal())
                .dietaryPreference(nutritionProfile.getDietaryPreference())
                .build();
    }

    @Override
    public com.thesweetlabbe.dto.UserAddressDTO mapAddressToDTO(com.thesweetlabbe.entity.UserAddress address) {
        if (address == null) return null;
        return com.thesweetlabbe.dto.UserAddressDTO.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .phone(address.getPhone())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .detailAddress(address.getDetailAddress())
                .fullAddress(address.getFullAddress())
                .addressType(address.getAddressType())
                .isDefault(address.isDefault())
                .build();
    }

    @Override
    public java.util.List<com.thesweetlabbe.dto.UserAddressDTO> mapAddressesToDTO(java.util.List<com.thesweetlabbe.entity.UserAddress> addresses) {
        if (addresses == null) return java.util.Collections.emptyList();
        return addresses.stream().map(this::mapAddressToDTO).toList();
    }
}
