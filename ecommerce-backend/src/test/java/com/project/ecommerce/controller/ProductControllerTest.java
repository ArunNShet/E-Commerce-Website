package com.project.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.ecommerce.config.SecurityConfig;
import com.project.ecommerce.dto.CreateProductRequest;
import com.project.ecommerce.dto.ProductResponse;
import com.project.ecommerce.model.ProductStatus;
import com.project.ecommerce.repository.UserRepository;
import com.project.ecommerce.security.JwtService;
import com.project.ecommerce.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.security.test.context.support.WithMockUser;

@WebMvcTest(ProductController.class)
@Import(SecurityConfig.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtService jwtService;

    @Test
    void getProducts_shouldBePublic() throws Exception {
        ProductResponse response = new ProductResponse(
                1L,
                "Phone",
                "250g",
                "Smart phone",
                "https://example.com/phone.png",
                BigDecimal.valueOf(499.99),
                10,
                ProductStatus.ACTIVE,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        when(productService.findAll(null)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Phone"));
    }

    @Test
    void createProduct_shouldRequireAuthentication() throws Exception {
        CreateProductRequest request = new CreateProductRequest(
                "Laptop",
                "500g",
                "Work laptop",
                "https://example.com/laptop.png",
                BigDecimal.valueOf(1200.00),
                5
        );

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_withAdminCredentials_shouldReturnCreated() throws Exception {
        CreateProductRequest request = new CreateProductRequest(
                "Laptop",
                "500g",
                "Work laptop",
                "https://example.com/laptop.png",
                BigDecimal.valueOf(1200.00),
                5
        );
        ProductResponse response = new ProductResponse(
                2L,
                "Laptop",
                "500g",
                "Work laptop",
                "https://example.com/laptop.png",
                BigDecimal.valueOf(1200.00),
                5,
                ProductStatus.ACTIVE,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        when(productService.create(any(CreateProductRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Laptop"));
    }
}
