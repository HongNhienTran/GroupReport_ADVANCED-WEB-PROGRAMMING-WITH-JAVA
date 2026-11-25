package com.sweetlab.backend.controller;

import com.sweetlab.backend.dto.response.ApiResponse;
import com.sweetlab.backend.dto.response.MediaUploadResponse;
import com.sweetlab.backend.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "Upload và xóa hình ảnh qua Cloudinary")
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload hình ảnh lên Cloudinary")
    public ResponseEntity<ApiResponse<MediaUploadResponse>> uploadImage(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "the-sweet-lab") String folder
    ) {
        return ResponseEntity.ok(ApiResponse.ok(mediaService.uploadImage(file, folder), "Image uploaded"));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa hình ảnh trên Cloudinary theo publicId (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@RequestParam("publicId") String publicId) {
        mediaService.deleteImage(publicId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Image deleted"));
    }
}
