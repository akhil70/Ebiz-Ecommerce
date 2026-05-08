package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.repository.OrderRepository;
//import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhook")
@RequiredArgsConstructor
public class RazorpayWebhookController {

    private final OrderRepository orderRepository;

    @Value("${razorpay.webhook.secret:rzp_webhook_dummy}")
    private String webhookSecret;

    @PostMapping("/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        try {
            // Verify signature
//            boolean isValid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
//            if (!isValid) {
//                System.out.println("⚠️ Razorpay Webhook error: Invalid signature.");
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//            }

            JSONObject event = new JSONObject(payload);
            String eventName = event.getString("event");

            if ("payment.captured".equals(eventName) || "order.paid".equals(eventName)) {
                JSONObject payloadObj = event.getJSONObject("payload");
                
                // Try to get order ID from payment or order object
                String orderId = null;
                if (payloadObj.has("payment") && payloadObj.getJSONObject("payment").has("entity")) {
                     JSONObject paymentEntity = payloadObj.getJSONObject("payment").getJSONObject("entity");
                     
                     // In our service, we set the internal order ID as "receipt" when creating the Razorpay order.
                     // It might be passed in notes or retrieved differently depending on what the event gives.
                     // The "receipt" is often echoed back in the order object.
                     
                     // Assuming order.paid event gives us the order entity:
                     if (payloadObj.has("order") && payloadObj.getJSONObject("order").has("entity")) {
                         orderId = payloadObj.getJSONObject("order").getJSONObject("entity").getString("receipt");
                     }
                }
                
                if (orderId != null) {
                    orderRepository.findById(orderId).ifPresent(order -> {
                        order.setStatus("PAID");
                        orderRepository.save(order);
                    });
                }
            }

            return ResponseEntity.ok("Received");
        } catch (Exception e) {
            System.out.println("⚠️ Razorpay Webhook processing error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
