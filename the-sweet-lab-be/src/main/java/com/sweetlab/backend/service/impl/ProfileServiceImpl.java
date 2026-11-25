package com.sweetlab.backend.service.impl;

import com.sweetlab.backend.dto.request.AddressRequest;
import com.sweetlab.backend.dto.request.UpdateNutritionProfileRequest;
import com.sweetlab.backend.dto.request.UpdateProfileRequest;
import com.sweetlab.backend.dto.response.UserProfileResponse;
import com.sweetlab.backend.entity.Account;
import com.sweetlab.backend.entity.NutritionProfile;
import com.sweetlab.backend.entity.User;
import com.sweetlab.backend.entity.UserAddress;
import com.sweetlab.backend.enums.ActivityLevel;
import com.sweetlab.backend.enums.Gender;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.exception.ResourceNotFoundException;
import com.sweetlab.backend.repository.AccountRepository;
import com.sweetlab.backend.repository.NutritionProfileRepository;
import com.sweetlab.backend.repository.UserAddressRepository;
import com.sweetlab.backend.repository.UserRepository;
import com.sweetlab.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final NutritionProfileRepository nutritionProfileRepository;
    private final UserAddressRepository addressRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long accountId) {
        Account account = findAccount(accountId);
        User user = findUser(accountId);
        return mapToResponse(account, user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long accountId, UpdateProfileRequest request) {
        Account account = findAccount(accountId);
        User user = findUser(accountId);

        String newPhone = request.getPhone().trim();
        if (!newPhone.equals(account.getPhone()) && accountRepository.existsByPhone(newPhone)) {
            throw new BadRequestException("Phone number is already used by another account");
        }

        account.setPhone(newPhone);
        accountRepository.save(account);

        user.setFullName(request.getFullName().trim());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        userRepository.save(user);

        return mapToResponse(account, user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateNutritionProfile(Long accountId, UpdateNutritionProfileRequest request) {
        Account account = findAccount(accountId);
        User user = findUser(accountId);

        NutritionProfile profile = nutritionProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> NutritionProfile.builder().user(user).build());

        profile.setHeightCm(request.getHeightCm());
        profile.setWeightKg(request.getWeightKg());
        profile.setActivityLevel(request.getActivityLevel());
        profile.getAllergens().clear();
        if (request.getAllergens() != null) {
            profile.getAllergens().addAll(request.getAllergens());
        }
        nutritionProfileRepository.save(profile);

        return mapToResponse(account, user);
    }

    @Override
    @Transactional
    public UserProfileResponse addAddress(Long accountId, AddressRequest request) {
        Account account = findAccount(accountId);
        User user = findUser(accountId);

        List<UserAddress> existing = addressRepository.findByUserId(user.getId());
        if (request.isDefault()) {
            existing.forEach(addr -> addr.setDefault(false));
            addressRepository.saveAll(existing);
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .recipientName(request.getRecipientName().trim())
                .phone(request.getPhone().trim())
                .province(request.getProvince().trim())
                .district(request.getDistrict().trim())
                .ward(request.getWard().trim())
                .detailAddress(request.getDetailAddress().trim())
                .type(request.getType())
                .isDefault(request.isDefault() || existing.isEmpty())
                .build();
        addressRepository.save(address);

        return mapToResponse(account, user);
    }

    @Override
    @Transactional
    public UserProfileResponse deleteAddress(Long accountId, Long addressId) {
        Account account = findAccount(accountId);
        User user = findUser(accountId);

        UserAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Address does not belong to current user");
        }
        addressRepository.delete(address);

        return mapToResponse(account, user);
    }

    private Account findAccount(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }

    private User findUser(Long accountId) {
        return userRepository.findByAccountId(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
    }

    private UserProfileResponse mapToResponse(Account account, User user) {
        NutritionProfile np = nutritionProfileRepository.findByUserId(user.getId()).orElse(null);
        UserProfileResponse.NutritionProfileDto nutritionDto = null;
        if (np != null) {
            double heightM = np.getHeightCm() / 100.0;
            double bmi = heightM > 0 ? Math.round((np.getWeightKg() / (heightM * heightM)) * 10.0) / 10.0 : 0.0;
            int age = user.getDateOfBirth() != null ? Period.between(user.getDateOfBirth(), LocalDate.now()).getYears() : 25;
            double bmr = 10 * np.getWeightKg() + 6.25 * np.getHeightCm() - 5 * age + (user.getGender() == Gender.FEMALE ? -161 : 5);
            double factor = switch (np.getActivityLevel()) {
                case SEDENTARY -> 1.2;
                case LIGHT -> 1.375;
                case MODERATE -> 1.55;
                case VERY_ACTIVE -> 1.725;
                case EXTRA_ACTIVE -> 1.9;
            };
            int calorieTarget = (int) Math.round(bmr * factor);
            double sugarLimit = Math.round(((calorieTarget * 0.05) / 4.0) * 10.0) / 10.0;

            nutritionDto = UserProfileResponse.NutritionProfileDto.builder()
                    .heightCm(np.getHeightCm())
                    .weightKg(np.getWeightKg())
                    .activityLevel(np.getActivityLevel())
                    .allergens(new HashSet<>(np.getAllergens()))
                    .bmi(bmi)
                    .dailyCalorieTarget(calorieTarget)
                    .dailySugarLimit(sugarLimit)
                    .build();
        }

        List<UserProfileResponse.AddressDto> addresses = addressRepository.findByUserId(user.getId()).stream()
                .map(a -> UserProfileResponse.AddressDto.builder()
                        .id(a.getId())
                        .recipientName(a.getRecipientName())
                        .phone(a.getPhone())
                        .province(a.getProvince())
                        .district(a.getDistrict())
                        .ward(a.getWard())
                        .detailAddress(a.getDetailAddress())
                        .type(a.getType())
                        .isDefault(a.isDefault())
                        .build())
                .toList();

        return UserProfileResponse.builder()
                .accountId(account.getId())
                .userId(user.getId())
                .email(account.getEmail())
                .phone(account.getPhone())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .role(account.getRole())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
                .nutritionProfile(nutritionDto)
                .addresses(addresses)
                .build();
    }
}
