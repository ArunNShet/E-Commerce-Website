package com.project.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    private final String productUploadsDirectory;

    public StaticResourceConfig(@Value("${app.upload.products-dir:uploads/products}") String productUploadsDirectory) {
        this.productUploadsDirectory = productUploadsDirectory;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(productUploadsDirectory).toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations(uploadPath.toUri().toString());
    }
}
