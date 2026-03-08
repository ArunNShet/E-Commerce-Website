package com.project.ecommerce.dto;

public record AuthResponse(
        String tokenType,
        String accessToken,
        String username,
        String role
) {
}
