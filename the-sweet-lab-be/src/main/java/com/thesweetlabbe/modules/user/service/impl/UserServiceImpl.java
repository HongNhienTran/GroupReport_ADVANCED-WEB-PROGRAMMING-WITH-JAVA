package com.thesweetlabbe.modules.user.service.impl;

import com.thesweetlabbe.common.enums.ErrorCode;
import com.thesweetlabbe.common.exception.AppException;
import com.thesweetlabbe.modules.user.dto.NutritionProfileDTO;
import com.thesweetlabbe.modules.user.dto.UserDTO;
import com.thesweetlabbe.modules.user.dto.UserProfileDTO;
import com.thesweetlabbe.modules.user.entity.NutritionProfile;
import com.thesweetlabbe.modules.user.entity.User;
import com.thesweetlabbe.modules.user.entity.UserProfile;
import com.thesweetlabbe.modules.user.repository.UserRepository;
import com.thesweetlabbe.modules.user.service.UserService;
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
                .build();
    }

    @Override
    public UserProfileDTO mapProfileToDTO(UserProfile profile) {
        if (profile == null) return null;
        return UserProfileDTO.builder()
                .phone(profile.getPhone())
                .address(profile.getAddress())
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
}
