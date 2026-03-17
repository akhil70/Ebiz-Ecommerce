package com.ebiz.backend.service;

import com.ebiz.backend.entity.SellerProfile;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.entity.enums.Role;
import com.ebiz.backend.repository.SellerProfileRepository;
import com.ebiz.backend.repository.UserRepository;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;
    private final StripeService stripeService;
    private final com.ebiz.backend.repository.ProductRepository productRepository;
    private final com.ebiz.backend.repository.OrderRepository orderRepository;

    /**
     * Upgrades a user to a Seller and generates a Stripe onboarding link.
     */
    public String onboardUserAsSeller(String email) throws StripeException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!Role.SELLER.name().equals(user.getRole())) {
            user.setRole(Role.SELLER.name());
            userRepository.save(user);
        }

        SellerProfile profile = sellerProfileRepository.findByUserId(user.getId())
                .orElse(new SellerProfile());

        if (profile.getStripeAccountId() == null) {
            String stripeAccountId = stripeService.createStripeAccount(email);
            profile.setUserId(user.getId());
            profile.setStripeAccountId(stripeAccountId);
            profile.setIsStripeOnboardingComplete(false);
            profile.setStoreName(user.getName() + "'s Store");
            sellerProfileRepository.save(profile);
        }

        return stripeService.createAccountLink(profile.getStripeAccountId());
    }

    public SellerProfile getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return sellerProfileRepository.findByUserId(user.getId()).orElse(null);
    }

    public java.util.List<com.ebiz.backend.entity.Product> getSellerProducts(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return productRepository.findBySellerId(user.getId());
    }

    public java.util.List<com.ebiz.backend.entity.Order> getSellerOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findOrdersBySellerId(user.getId());
    }
}
