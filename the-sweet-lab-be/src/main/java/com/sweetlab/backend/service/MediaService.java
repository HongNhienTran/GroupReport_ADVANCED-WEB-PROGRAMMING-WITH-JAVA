package com.sweetlab.backend.service;

import com.sweetlab.backend.dto.response.MediaUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {

    MediaUploadResponse uploadImage(MultipartFile file, String folder);

    void deleteImage(String publicId);
}
