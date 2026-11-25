package com.sweetlab.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadResponse {
    private String publicId;
    private String url;
    private String format;
    private long bytes;
}
