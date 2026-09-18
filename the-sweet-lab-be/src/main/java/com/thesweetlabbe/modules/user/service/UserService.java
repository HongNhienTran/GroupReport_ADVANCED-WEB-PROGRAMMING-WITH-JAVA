package com.thesweetlabbe.modules.user.service;

import com.thesweetlabbe.modules.user.dto.NutritionProfileDTO;
import com.thesweetlabbe.modules.user.dto.UserDTO;
import com.thesweetlabbe.modules.user.dto.UserProfileDTO;
import com.thesweetlabbe.modules.user.entity.NutritionProfile;
import com.thesweetlabbe.modules.user.entity.User;
import com.thesweetlabbe.modules.user.entity.UserProfile;

import java.util.UUID;

public interface UserService {

    UserDTO getUserProfile(UUID userId);

    UserDTO mapToDTO(User user);

    UserProfileDTO mapProfileToDTO(UserProfile profile);

    NutritionProfileDTO mapNutritionToDTO(NutritionProfile nutritionProfile);

    com.thesweetlabbe.modules.user.dto.UserAddressDTO mapAddressToDTO(com.thesweetlabbe.modules.user.entity.UserAddress address);

    java.util.List<com.thesweetlabbe.modules.user.dto.UserAddressDTO> mapAddressesToDTO(java.util.List<com.thesweetlabbe.modules.user.entity.UserAddress> addresses);
}
