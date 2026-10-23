package com.thesweetlabbe.service;

import com.thesweetlabbe.dto.NutritionProfileDTO;
import com.thesweetlabbe.dto.UserDTO;
import com.thesweetlabbe.dto.UserProfileDTO;
import com.thesweetlabbe.entity.NutritionProfile;
import com.thesweetlabbe.entity.User;
import com.thesweetlabbe.entity.UserProfile;

import java.util.UUID;

public interface UserService {

    UserDTO getUserProfile(UUID userId);

    UserDTO mapToDTO(User user);

    UserProfileDTO mapProfileToDTO(UserProfile profile);

    NutritionProfileDTO mapNutritionToDTO(NutritionProfile nutritionProfile);

    com.thesweetlabbe.dto.UserAddressDTO mapAddressToDTO(com.thesweetlabbe.entity.UserAddress address);

    java.util.List<com.thesweetlabbe.dto.UserAddressDTO> mapAddressesToDTO(java.util.List<com.thesweetlabbe.entity.UserAddress> addresses);
}
