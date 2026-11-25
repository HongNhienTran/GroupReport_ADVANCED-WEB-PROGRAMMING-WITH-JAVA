package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.request.AddressRequest;
import com.sweetlab.backend.dto.request.UpdateNutritionProfileRequest;
import com.sweetlab.backend.dto.request.UpdateProfileRequest;
import com.sweetlab.backend.dto.response.UserProfileResponse;

public interface ProfileService {

    UserProfileResponse getProfile(Long accountId);

    UserProfileResponse updateProfile(Long accountId, UpdateProfileRequest request);

    UserProfileResponse updateNutritionProfile(Long accountId, UpdateNutritionProfileRequest request);

    UserProfileResponse addAddress(Long accountId, AddressRequest request);

    UserProfileResponse deleteAddress(Long accountId, Long addressId);
}
