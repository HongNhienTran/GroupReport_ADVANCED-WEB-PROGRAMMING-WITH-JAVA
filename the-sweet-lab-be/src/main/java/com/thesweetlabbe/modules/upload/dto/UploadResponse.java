package com.thesweetlabbe.modules.upload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {
    private String imageUrl;
    private String publicId;
    private String format;
    private Long sizeBytes;
    private Integer width;
    private Integer height;
}
