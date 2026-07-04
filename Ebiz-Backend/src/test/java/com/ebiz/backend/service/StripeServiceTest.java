package com.ebiz.backend.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.checkout.Session;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class StripeServiceTest {

    private StripeService stripeService;
    private MockedStatic<Account> mockedAccount;
    private MockedStatic<AccountLink> mockedAccountLink;
    private MockedStatic<Session> mockedSession;

    @BeforeEach
    void setUp() {
        stripeService = new StripeService();
        ReflectionTestUtils.setField(stripeService, "stripeSecretKey", "sk_test_mock");
        ReflectionTestUtils.setField(stripeService, "frontendUrl", "http://localhost:3000");
        stripeService.init();

        mockedAccount = Mockito.mockStatic(Account.class);
        mockedAccountLink = Mockito.mockStatic(AccountLink.class);
        mockedSession = Mockito.mockStatic(Session.class);
    }

    @AfterEach
    void tearDown() {
        mockedAccount.close();
        mockedAccountLink.close();
        mockedSession.close();
    }

    @Test
    void testCreateStripeAccount() throws StripeException {
        Account mockAcc = mock(Account.class);
        when(mockAcc.getId()).thenReturn("acct_mock123");
        mockedAccount.when(() -> Account.create(any(AccountCreateParams.class))).thenReturn(mockAcc);

        String result = stripeService.createStripeAccount("test@example.com");
        assertEquals("acct_mock123", result);
    }

    @Test
    void testCreateAccountLink() throws StripeException {
        AccountLink mockLink = mock(AccountLink.class);
        when(mockLink.getUrl()).thenReturn("https://stripe.com/onboard/mock");
        mockedAccountLink.when(() -> AccountLink.create(any(AccountLinkCreateParams.class))).thenReturn(mockLink);

        String result = stripeService.createAccountLink("acct_mock123");
        assertEquals("https://stripe.com/onboard/mock", result);
    }

    @Test
    void testCreateCheckoutSession() throws StripeException {
        Session mockSess = mock(Session.class);
        when(mockSess.getUrl()).thenReturn("https://stripe.com/checkout/mock");
        mockedSession.when(() -> Session.create(any(SessionCreateParams.class))).thenReturn(mockSess);

        String result = stripeService.createCheckoutSession(
                Collections.emptyList(),
                "acct_mock123",
                BigDecimal.valueOf(100),
                "order_123"
        );
        assertEquals("https://stripe.com/checkout/mock", result);
    }
}
