package com.project.ecommerce.controller;

import com.project.ecommerce.dto.ImageUploadResponse;
import com.project.ecommerce.service.ProductImageStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final ProductImageStorageService productImageStorageService;

    public UploadController(ProductImageStorageService productImageStorageService) {
        this.productImageStorageService = productImageStorageService;
    }

    @PostMapping("/products")
    public ResponseEntity<ImageUploadResponse> uploadProductImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = productImageStorageService.store(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ImageUploadResponse(imageUrl));
    }
}
