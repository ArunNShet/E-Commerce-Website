package com.project.ecommerce.service;

import com.project.ecommerce.dto.CreateProductRequest;
import com.project.ecommerce.dto.ProductResponse;
import com.project.ecommerce.exception.ResourceNotFoundException;
import com.project.ecommerce.model.Product;
import com.project.ecommerce.model.ProductStatus;
import com.project.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void create_shouldSetStatusActiveWhenStockPositive() {
        CreateProductRequest request = new CreateProductRequest(
                "Phone",
                "250g",
                "Smart phone",
                "https://example.com/phone.png",
                BigDecimal.valueOf(899.99),
                3
        );

        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(1L);
            return product;
        });

        ProductResponse response = productService.create(request);

        assertEquals(ProductStatus.ACTIVE, response.status());
        assertEquals("Phone", response.name());
    }

    @Test
    void create_shouldSetOutOfStockWhenStockZero() {
        CreateProductRequest request = new CreateProductRequest(
                "Cable",
                "100g",
                "Fast charging cable",
                "https://example.com/cable.png",
                BigDecimal.valueOf(9.99),
                0
        );

        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(2L);
            return product;
        });

        ProductResponse response = productService.create(request);

        assertEquals(ProductStatus.OUT_OF_STOCK, response.status());
    }

    @Test
    void findById_shouldThrowWhenMissing() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.findById(99L));
    }
}
