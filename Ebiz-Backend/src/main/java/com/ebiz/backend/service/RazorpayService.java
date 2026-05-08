package com.ebiz.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id:rzp_test_dummy}")
    private String keyId;

    @Value("${razorpay.key.secret:dummy_secret}")
    private String keySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(keyId, keySecret);
    }

    /**
     * Creates a Razorpay Order
     * @param amount The total amount in INR (will be converted to paise internally)
     * @param orderId The internal order ID
     * @param sellerRazorpayAccountId The Razorpay Linked Account ID (for transfers) - optional
     * @return Razorpay Order ID
     * @throws RazorpayException if Razorpay API fails
     */
    public String createCheckoutOrder(BigDecimal amount, String orderId, String sellerRazorpayAccountId) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        
        // Basic currency conversion: Assume base price is USD, convert to INR (e.g. 1 USD = 83 INR)
        BigDecimal amountInInr = amount.multiply(BigDecimal.valueOf(83));
        
        // Convert INR amount to paise (multiply by 100)
        long amountInPaise = amountInInr.multiply(BigDecimal.valueOf(100)).longValue();
        
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", orderId);

        // Note: For now, we are skipping the `transfers` logic (Razorpay Route) 
        // to simplify the flow, but it can be added here if `sellerRazorpayAccountId` is valid.
        
        Order order = razorpayClient.orders.create(orderRequest);
        return order.get("id");
    }
}
