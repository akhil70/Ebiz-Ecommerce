package com.ebiz.backend.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String SOCIAL_SYNC_QUEUE = "facebook.catalog.queue";
    public static final String SOCIAL_SYNC_EXCHANGE = "social.sync.exchange";
    public static final String SOCIAL_SYNC_ROUTING_KEY = "social.sync.routingKey";

    @Bean
    public Queue socialSyncQueue() {
        return new Queue(SOCIAL_SYNC_QUEUE, true); // durable queue
    }

    @Bean
    public DirectExchange socialSyncExchange() {
        return new DirectExchange(SOCIAL_SYNC_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue socialSyncQueue, DirectExchange socialSyncExchange) {
        return BindingBuilder.bind(socialSyncQueue).to(socialSyncExchange).with(SOCIAL_SYNC_ROUTING_KEY);
    }
}
