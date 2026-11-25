package com.sweetlab.backend.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sweetlab.backend.dto.response.MediaUploadResponse;
import com.sweetlab.backend.exception.AppException;
import com.sweetlab.backend.exception.BadRequestException;
import com.sweetlab.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private static final String DEFAULT_FOLDER = "the-sweet-lab";

    private final Cloudinary cloudinary;

    @Override
    @SuppressWarnings("unchecked")
    public MediaUploadResponse uploadImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file must not be empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }

        String targetFolder = (folder == null || folder.isBlank()) ? DEFAULT_FOLDER : folder.trim();
        try {
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", targetFolder, "resource_type", "image")
            );
            return MediaUploadResponse.builder()
                    .publicId((String) result.get("public_id"))
                    .url((String) result.get("secure_url"))
                    .format((String) result.get("format"))
                    .bytes(result.get("bytes") instanceof Number n ? n.longValue() : 0L)
                    .build();
        } catch (IOException ex) {
            throw new AppException(HttpStatus.BAD_GATEWAY, "Failed to upload image to Cloudinary: " + ex.getMessage());
        }
    }

    @Override
    public void deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            throw new BadRequestException("publicId must not be empty");
        }
        try {
            cloudinary.uploader().destroy(publicId.trim(), ObjectUtils.emptyMap());
        } catch (IOException ex) {
            throw new AppException(HttpStatus.BAD_GATEWAY, "Failed to delete image from Cloudinary: " + ex.getMessage());
        }
    }
}
