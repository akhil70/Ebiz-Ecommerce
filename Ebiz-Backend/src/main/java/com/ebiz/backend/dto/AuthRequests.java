package com.ebiz.backend.dto;

import lombok.Data;

@Data
public class AuthRequests {

    @Data
    public static class SendOtpRequest {
        private String email;
    }

    @Data
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
        private String password;
        private String name;
        private String role; // Optional, defaults to USER
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }
}
