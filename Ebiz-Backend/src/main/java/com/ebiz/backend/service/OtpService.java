package com.ebiz.backend.service;

import com.ebiz.backend.entity.OtpCode;
import com.ebiz.backend.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpCodeRepository otpCodeRepository;
    private final JavaMailSender mailSender;

    public void generateAndSendOtp(String email) {
        // 1. Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // 2. Remove existing pending OTP for this email (if any)
        otpCodeRepository.deleteByEmail(email);

        // 3. Save new OTP to MongoDB
        OtpCode otpCode = OtpCode.builder()
                .email(email)
                .otp(otp)
                .build();
        otpCodeRepository.save(otpCode);

        // 4. Send email via Gmail SMTP
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Ebiz - Your Signup Validation Code");
            message.setText("Welcome to Ebiz!\n\nYour 6-digit validation code is: " + otp
                    + "\n\nThis code will expire in 5 minutes.");

            mailSender.send(message);
            log.info("OTP sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", email, e);
            throw new RuntimeException("Failed to send verification email. Please try again later.");
        }
    }

    public boolean verifyOtp(String email, String enteredOtp) {
        Optional<OtpCode> optionalOtpCode = otpCodeRepository.findByEmail(email);

        if (optionalOtpCode.isEmpty()) {
            return false; // No OTP requested or it expired (due to TTL)
        }

        OtpCode otpCode = optionalOtpCode.get();

        if (otpCode.getOtp().equals(enteredOtp)) {
            // Success: Clean up as it's a one-time use
            otpCodeRepository.delete(otpCode);
            return true;
        }

        return false;
    }
}
