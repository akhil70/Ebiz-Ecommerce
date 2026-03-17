package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.dto.SocialCheckoutRequest;
import com.ebiz.backend.entity.*;
import com.ebiz.backend.repository.GuestBuyerRepository;
import com.ebiz.backend.repository.OrderRepository;
import com.ebiz.backend.repository.ProductRepository;
import com.ebiz.backend.repository.SellerProfileRepository;
import com.ebiz.backend.service.StripeService;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/social")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For the headless front-end checkout UI
public class SocialCheckoutController {

    private final ProductRepository productRepository;
    private final GuestBuyerRepository guestBuyerRepository;
    private final OrderRepository orderRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final StripeService stripeService;

    /**
     * Fetch lightweight product details for the social media landing page.
     * Unauthenticated.
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductForSocial(@PathVariable String id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Handle guest orders coming directly from social media checkout links.
     * Captures social handles and delivery details, then routes to payment.
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> initiateSocialCheckout(@RequestBody SocialCheckoutRequest request) {
        try {
            // 1. Fetch the product to ensure valid purchase and get seller Id
            if (request.getItems() == null || request.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body("No items provided");
            }

            SocialCheckoutRequest.CheckoutItem firstItem = request.getItems().get(0); // Assuming one product per social
                                                                                      // link
            Product product = productRepository.findById(firstItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            SellerProfile sellerProfile = sellerProfileRepository.findByUserId(product.getSellerId())
                    .orElseThrow(() -> new RuntimeException("Seller profile not found for product"));

            if (sellerProfile.getStripeAccountId() == null) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body("Seller is not ready to receive payments yet. Missing Stripe account.");
            }

            // 2. Save or update GuestBuyer logging info
            GuestBuyer buyer = guestBuyerRepository.findBySocialMediaHandleAndPlatform(
                    request.getSocialMediaHandle(), request.getPlatform()).orElse(new GuestBuyer());

            buyer.setSocialMediaHandle(request.getSocialMediaHandle());
            buyer.setPlatform(request.getPlatform());
            buyer.setEmail(request.getEmail());
            buyer.setPhoneNumber(request.getPhoneNumber());
            buyer = guestBuyerRepository.save(buyer);

            // 3. Create the Order
            Order order = new Order();
            order.setGuestBuyerId(buyer.getId());
            order.setShippingAddress(request.getShippingAddress());

            java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;
            java.util.List<SessionCreateParams.LineItem> stripeLineItems = new java.util.ArrayList<>();

            for (SocialCheckoutRequest.CheckoutItem item : request.getItems()) {
                Product p = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                OrderItem orderItem = new OrderItem();
                orderItem.setProductId(p.getId());
                orderItem.setProductName(p.getName());
                orderItem.setPrice(p.getPrice());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setSellerId(p.getSellerId());
                order.addItem(orderItem);

                totalAmount = totalAmount.add(p.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));

                stripeLineItems.add(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(item.getQuantity().longValue())
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(p.getPrice().multiply(java.math.BigDecimal.valueOf(100))
                                                        .longValue())
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(p.getName())
                                                                .build())
                                                .build())
                                .build());
            }

            order.setTotalAmount(totalAmount);
            order = orderRepository.save(order);

            // 4. Initiate payment session (e.g., Stripe)
            // Example: 10% platform fee
            java.math.BigDecimal applicationFeeAmountCent = totalAmount.multiply(java.math.BigDecimal.valueOf(100))
                    .multiply(java.math.BigDecimal.valueOf(0.10));

            String checkoutUrl = stripeService.createCheckoutSession(
                    stripeLineItems,
                    sellerProfile.getStripeAccountId(),
                    applicationFeeAmountCent,
                    order.getId());

            // Return checkout URL to the frontend redirect logic
            return ResponseEntity.ok().body(java.util.Map.of("url", checkoutUrl));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error initiating checkout: " + e.getMessage());
        }
    }
}
