package com.thesweetlabbe.modules.upload.controller;

import com.thesweetlabbe.common.dto.ApiResponse;
import com.thesweetlabbe.modules.upload.dto.UploadResponse;
import com.thesweetlabbe.modules.upload.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
@Tag(name = "Upload Module", description = "Endpoints for uploading media & images to Cloudinary")
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải ảnh lên Cloudinary", description = "Hỗ trợ tải ảnh sản phẩm, avatar, review lên Cloudinary và nhận về secure URL")
    public ApiResponse<UploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "the-sweet-lab/products") String folder
    ) {
        UploadResponse response = cloudinaryService.uploadImage(file, folder);
        return ApiResponse.success("Upload ảnh thành công", response);
    }

    @DeleteMapping("/image")
    @Operation(summary = "Xóa ảnh trên Cloudinary bằng public_id")
    public ApiResponse<Boolean> deleteImage(@RequestParam("publicId") String publicId) {
        boolean deleted = cloudinaryService.deleteImage(publicId);
        return ApiResponse.success(deleted ? "Xóa ảnh thành công" : "Không tìm thấy hoặc xóa thất bại", deleted);
    }
}
