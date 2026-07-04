package com.ebiz.backend.controller.public_api;

import com.ebiz.backend.entity.Order;
import com.ebiz.backend.repository.OrderRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class StripeWebhookControllerTest {

    private StripeWebhookController controller;
    private OrderRepository orderRepository;
    private MockedStatic<Webhook> mockedWebhook;

    @BeforeEach
    void setUp() {
        orderRepository = mock(OrderRepository.class);
        controller = new StripeWebhookController(orderRepository);
        ReflectionTestUtils.setField(controller, "endpointSecret", "whsec_mock");
        mockedWebhook = Mockito.mockStatic(Webhook.class);
    }

    @AfterEach
    void tearDown() {
        mockedWebhook.close();
    }

    @Test
    void testHandleStripeEvent_Success() throws Exception {
        String payload = "{}";
        String sigHeader = "t=123,v1=mock";

        Event mockEvent = mock(Event.class);
        when(mockEvent.getType()).thenReturn("checkout.session.completed");

        EventDataObjectDeserializer mockDeserializer = mock(EventDataObjectDeserializer.class);
        Session mockSession = mock(Session.class);
        when(mockSession.getClientReferenceId()).thenReturn("order_123");

        when(mockDeserializer.getObject()).thenReturn(Optional.of(mockSession));
        when(mockEvent.getDataObjectDeserializer()).thenReturn(mockDeserializer);

        mockedWebhook.when(() -> Webhook.constructEvent(eq(payload), eq(sigHeader), eq("whsec_mock")))
                .thenReturn(mockEvent);

        Order mockOrder = new Order();
        mockOrder.setId("order_123");
        mockOrder.setStatus("PENDING");

        when(orderRepository.findById("order_123")).thenReturn(Optional.of(mockOrder));

        ResponseEntity<String> response = controller.handleStripeEvent(payload, sigHeader);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Received", response.getBody());

        verify(orderRepository, times(1)).findById("order_123");
        verify(orderRepository, times(1)).save(argThat(order -> "PAID".equals(order.getStatus())));
    }

    @Test
    void testHandleStripeEvent_SignatureVerificationFailed() throws Exception {
        String payload = "{}";
        String sigHeader = "invalid_sig";

        mockedWebhook.when(() -> Webhook.constructEvent(eq(payload), eq(sigHeader), eq("whsec_mock")))
                .thenThrow(new SignatureVerificationException("Invalid signature", sigHeader));

        ResponseEntity<String> response = controller.handleStripeEvent(payload, sigHeader);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        verify(orderRepository, never()).findById(anyString());
    }
}
