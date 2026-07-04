package com.ebiz.backend.service;

import com.ebiz.backend.dto.CartRequest;
import com.ebiz.backend.entity.Cart;
import com.ebiz.backend.entity.CartItem;
import com.ebiz.backend.entity.Product;
import com.ebiz.backend.repository.CartRepository;
import com.ebiz.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart getCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepository.save(newCart);
                });

        if (cart.getItems() != null && !cart.getItems().isEmpty()) {
            for (CartItem item : cart.getItems()) {
                productRepository.findById(item.getProductId()).ifPresent(product -> {
                    String img = (product.getThumbnail() != null && !product.getThumbnail().isEmpty())
                            ? product.getThumbnail()
                            : (product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "");
                    item.setName(product.getName());
                    item.setImage(img);
                    item.setPrice(product.getPrice());
                });
            }
            cart.calculateTotalPrice();
        }

        return cart;
    }

    public Cart addToCart(String userId, CartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

        Cart cart = getCart(userId);

        // Check if item already exists
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.isSameItem(request.getProductId(), request.getSelectedSize(),
                        request.getSelectedColor()))
                .findFirst();

        int currentQuantityInCart = existingItemOpt.map(CartItem::getQuantity).orElse(0);
        int totalRequestedQuantity = currentQuantityInCart + request.getQuantity();

        validateStock(product, request.getSelectedSize(), totalRequestedQuantity);

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(totalRequestedQuantity);
            // Update price in case it changed
            existingItem.setPrice(product.getPrice());
        } else {
            String img = (product.getThumbnail() != null && !product.getThumbnail().isEmpty())
                    ? product.getThumbnail()
                    : (product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "");

            CartItem newItem = CartItem.builder()
                    .productId(product.getId())
                    .name(product.getName())
                    .image(img)
                    .selectedSize(request.getSelectedSize())
                    .selectedColor(request.getSelectedColor())
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .imageId(product.getId())
                    .build();
            cart.getItems().add(newItem);
        }

        cart.calculateTotalPrice();
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String userId, CartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

        Cart cart = getCart(userId);

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.isSameItem(request.getProductId(), request.getSelectedSize(),
                        request.getSelectedColor()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            validateStock(product, request.getSelectedSize(), request.getQuantity());
            CartItem existingItem = existingItemOpt.get();
            if (request.getQuantity() <= 0) {
                cart.getItems().remove(existingItem);
            } else {
                existingItem.setQuantity(request.getQuantity());
            }
            cart.calculateTotalPrice();
            return cartRepository.save(cart);
        } else {
            throw new RuntimeException("Item not found in cart");
        }
    }

    public Cart removeFromCart(String userId, String productId, String selectedSize, String selectedColor) {
        Cart cart = getCart(userId);
        cart.getItems().removeIf(item -> item.isSameItem(productId, selectedSize, selectedColor));
        cart.calculateTotalPrice();
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cart.calculateTotalPrice();
        cartRepository.save(cart);
    }

    private void validateStock(Product product, String selectedSize, int requestedQuantity) {
        int availableStock = 0;

        if (selectedSize != null && !selectedSize.trim().isEmpty() && product.getSizeStocks() != null) {
            Optional<Product.SizeStock> sizeStockOpt = product.getSizeStocks().stream()
                    .filter(s -> s.getSize() != null && s.getSize().equalsIgnoreCase(selectedSize))
                    .findFirst();
            if (sizeStockOpt.isPresent() && sizeStockOpt.get().getStock() != null) {
                availableStock = sizeStockOpt.get().getStock();
            } else if (product.getStock() != null) {
                availableStock = product.getStock();
            }
        } else if (product.getStock() != null) {
            availableStock = product.getStock();
        }

        if (requestedQuantity > availableStock) {
            throw new RuntimeException("Item stock exceeded");
        }
    }
}
