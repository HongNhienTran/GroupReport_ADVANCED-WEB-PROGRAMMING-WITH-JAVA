package com.thesweetlabbe.modules.upload.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.thesweetlabbe.common.enums.ErrorCode;
import com.thesweetlabbe.common.exception.AppException;
import com.thesweetlabbe.modules.upload.dto.UploadResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload an image to Cloudinary in a specific folder.
     *
     * @param file   MultipartFile from client
     * @param folder Folder on Cloudinary (e.g. "the-sweet-lab/products")
     * @return UploadResponse containing secure_url, public_id and image metadata
     */
    public UploadResponse uploadImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "File is empty or not provided.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.INVALID_FILE_FORMAT, "Only image files are allowed.");
        }

        try {
            String targetFolder = (folder != null && !folder.isBlank()) ? folder : "the-sweet-lab/products";

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", targetFolder,
                            "resource_type", "image"
                    )
            );

            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            String format = (String) uploadResult.get("format");
            Number bytes = (Number) uploadResult.get("bytes");
            Number width = (Number) uploadResult.get("width");
            Number height = (Number) uploadResult.get("height");

            log.info("Uploaded image to Cloudinary successfully. Public ID: {}, URL: {}", publicId, secureUrl);

            return UploadResponse.builder()
                    .imageUrl(secureUrl)
                    .publicId(publicId)
                    .format(format)
                    .sizeBytes(bytes != null ? bytes.longValue() : file.getSize())
                    .width(width != null ? width.intValue() : null)
                    .height(height != null ? height.intValue() : null)
                    .build();

        } catch (IOException e) {
            log.error("Cloudinary upload failed: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED, "Failed to upload image to Cloudinary: " + e.getMessage());
        }
    }

    /**
     * Delete an image from Cloudinary by public ID.
     *
     * @param publicId The Cloudinary public_id of the image
     * @return true if successfully destroyed or not found
     */
    public boolean deleteImage(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return false;
        }
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Destroy result for publicId {}: {}", publicId, result);
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary: {}", e.getMessage(), e);
            return false;
        }
    }
}
