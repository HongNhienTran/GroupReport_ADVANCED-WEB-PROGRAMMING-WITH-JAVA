package com.thesweetlabbe.modules.product.controller;

import com.thesweetlabbe.common.config.JsonDataLoader;
import com.thesweetlabbe.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/data")
@RequiredArgsConstructor
@Tag(name = "Data Import Module", description = "Các API hỗ trợ nạp dữ liệu mẫu từ các file JSON vào Database")
public class DataImportController {

    private final JsonDataLoader jsonDataLoader;

    @PostMapping("/import-json")
    @Operation(
            summary = "Nạp dữ liệu từ các file JSON trong resources/data/",
            description = "Tự động quét tất cả các file JSON theo cấu trúc data/<loaibanh>/tenloai_data_sample.json và thêm vào CSDL PostgreSQL."
    )
    public ApiResponse<String> importJsonData() {
        int count = jsonDataLoader.loadAllJsonData();
        return ApiResponse.success("Đã quét và nạp dữ liệu thành công! Tổng số sản phẩm được xử lý: " + count, "OK");
    }
}
