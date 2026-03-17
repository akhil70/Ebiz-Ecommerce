package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.entity.Order;
import com.ebiz.backend.repository.OrderRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhook")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final OrderRepository orderRepository;

    @Value("${stripe.webhook.secret:whsec_dummy}")
    private String endpointSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            System.out.println("⚠️  Webhook error while validating signature.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Handle the event
        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);

            if (stripeObject instanceof Session) {
                Session session = (Session) stripeObject;
                String orderId = session.getClientReferenceId();

                if (orderId != null) {
                    orderRepository.findById(orderId).ifPresent(order -> {
                        order.setStatus("PAID");
                        orderRepository.save(order);
                    });
                }
            }
        }

        return ResponseEntity.ok("Received");
    }
}
