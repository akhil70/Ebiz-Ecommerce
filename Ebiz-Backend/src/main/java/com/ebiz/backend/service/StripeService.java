package com.ebiz.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.checkout.Session;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class StripeService {

        @Value("${stripe.secret.key:sk_test_dummy}")
        private String stripeSecretKey;

        @Value("${app.frontend.url:http://localhost:3000}")
        private String frontendUrl;

        @PostConstruct
        public void init() {
                Stripe.apiKey = stripeSecretKey;
        }

        /**
         * Creates a Stripe Connected Account for a new Seller.
         */
        public String createStripeAccount(String email) throws StripeException {
                AccountCreateParams params = AccountCreateParams.builder()
                                .setType(AccountCreateParams.Type.EXPRESS)
                                .setEmail(email)
                                .build();

                Account account = Account.create(params);
                return account.getId();
        }

        /**
         * Generates an onboarding link for the Seller to complete their Stripe setup.
         */
        public String createAccountLink(String accountId) throws StripeException {
                AccountLinkCreateParams params = AccountLinkCreateParams.builder()
                                .setAccount(accountId)
                                .setRefreshUrl(frontendUrl + "/seller/onboarding/refresh")
                                .setReturnUrl(frontendUrl + "/seller/onboarding/success")
                                .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                                .build();

                AccountLink accountLink = AccountLink.create(params);
                return accountLink.getUrl();
        }

        /**
         * Creates a Checkout Session where the funds are routed to the Seller,
         * dropping a percentage as a Mediator Application Fee.
         */
        public String createCheckoutSession(List<SessionCreateParams.LineItem> lineItems, String sellerStripeAccountId,
                        BigDecimal applicationFeeAmountCent, String orderId) throws StripeException {

                SessionCreateParams.PaymentIntentData paymentIntentData = SessionCreateParams.PaymentIntentData
                                .builder()
                                .setApplicationFeeAmount(applicationFeeAmountCent.longValue())
                                .setTransferData(
                                                SessionCreateParams.PaymentIntentData.TransferData.builder()
                                                                .setDestination(sellerStripeAccountId)
                                                                .build())
                                .build();

                SessionCreateParams params = SessionCreateParams.builder()
                                .setMode(SessionCreateParams.Mode.PAYMENT)
                                .setSuccessUrl(frontendUrl + "/social/checkout/success")
                                .setCancelUrl(frontendUrl + "/social/checkout/cancel")
                                .addAllLineItem(lineItems)
                                .setPaymentIntentData(paymentIntentData)
                                .setClientReferenceId(orderId)
                                .build();

                Session session = Session.create(params);
                return session.getUrl();
        }
}
