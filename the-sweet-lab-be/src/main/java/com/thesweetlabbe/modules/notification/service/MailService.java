package com.thesweetlabbe.modules.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from:The Sweet Lab <no-reply@thesweetlab.com>}")
    private String fromEmail;

    @Value("${app.mail.verification-url:http://localhost:3000/verify-email}")
    private String baseVerificationUrl;

    @Value("${app.mail.verification-token-expiration-minutes:15}")
    private int tokenExpirationMinutes;

    @Async
    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        try {
            log.info("Preparing verification email for: {}", toEmail);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            Context context = new Context();
            context.setVariable("recipientName", fullName);
            context.setVariable("verificationToken", token);
            context.setVariable("verificationUrl", baseVerificationUrl + "?token=" + token);
            context.setVariable("expirationMinutes", tokenExpirationMinutes);

            String htmlContent = templateEngine.process("email/verification-email", context);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🌿 The Sweet Lab - Xác thực kích hoạt tài khoản của bạn");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }
}
