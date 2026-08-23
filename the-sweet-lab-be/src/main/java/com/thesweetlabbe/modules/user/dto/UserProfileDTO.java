package com.thesweetlabbe.modules.user.dto;

import com.thesweetlabbe.modules.user.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private String phone;
    private String address;
    private String avatar;
    private LocalDate dateOfBirth;
    private Gender gender;
}
