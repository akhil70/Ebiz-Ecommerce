package com.ebiz.backend.listener;

import com.ebiz.backend.config.RabbitMQConfig;
import com.ebiz.backend.repository.ProductRepository;
import com.ebiz.backend.service.MetaGraphApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocialMediaSyncListener {

    private final ProductRepository productRepository;
    private final MetaGraphApiService metaGraphApiService;

    @RabbitListener(queues = RabbitMQConfig.SOCIAL_SYNC_QUEUE)
    public void handleProductSync(String productId) {
        log.info("Received request to sync product ID: {} to social media", productId);
        
        productRepository.findById(productId).ifPresentOrElse(
            product -> metaGraphApiService.syncProductToFacebook(product),
            () -> log.warn("Product with ID {} not found, cannot sync to Facebook", productId)
        );
    }
}
