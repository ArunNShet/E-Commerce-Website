package com.project.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class ProductImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp", ".gif");

    private final Path uploadDirectory;

    public ProductImageStorageService(@Value("${app.upload.products-dir:uploads/products}") String uploadDirectory) {
        this.uploadDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image file to upload.");
        }

        String originalFilename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().trim();
        String extension = extractExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Only JPG, JPEG, PNG, WEBP, or GIF files are allowed.");
        }

        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        if (!contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Uploaded file must be an image.");
        }

        try {
            Files.createDirectories(uploadDirectory);
            String savedFileName = UUID.randomUUID() + extension;
            Path targetFile = uploadDirectory.resolve(savedFileName).normalize();
            if (!targetFile.startsWith(uploadDirectory)) {
                throw new IllegalStateException("Invalid upload path.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/products/" + savedFileName;
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to save image file.", ex);
        }
    }

    private String extractExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0) {
            return "";
        }
        return filename.substring(dotIndex).toLowerCase();
    }
}
