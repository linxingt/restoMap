package com.restomap.backend.auth.service;

import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Map;
import java.util.Properties;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final RestClient restClient;

    @Value("${spring.mail.username}")
    private String fromEmail;
    @Value("${cors.allowed-origin}")
    private String allowedOrigin;
    @Value("${google.oauth.client-id}")
    private String clientId;
    @Value("${google.oauth.client-secret}")
    private String clientSecret;
    @Value("${google.oauth.refresh-token}")
    private String refreshToken;

    public EmailService() {
        this.restClient = RestClient.create();
    }

    @Async
    public void sendVerificationEmail(String toEmail, String code) {
        try {
            MimeMessage message = createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(fromEmail, "RestoMap No-Reply"));

            helper.setTo(toEmail);
            helper.setSubject("RestoMap - Votre code de vérification");
            helper.setText(
                    "Bonjour,\n\n" +
                            "Voici votre code de vérification à 6 caractères pour vous connecter : " + code + "\n\n" +
                            "Ce code est valable pour une connexion sécurisée.\n" +
                            "Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.\n\n" +
                            "RestoMap"
            );
            sendViaGmailApi(message);
            log.info("E-mail de vérification envoyé via l'API Gmail à : {}", toEmail);
        } catch (Exception e) {
            log.error("Échec de l'envoi de l'e-mail de vérification : {}", e.getMessage());
            throw new RuntimeException("Échec de l'envoi de l'e-mail de vérification", e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            MimeMessage message = createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(fromEmail, "RestoMap No-Reply"));
            helper.setTo(toEmail);
            helper.setSubject("RestoMap - Réinitialisation de votre mot de passe");

            String resetLink = allowedOrigin + "/restoMap/?resetToken=" + token;

            helper.setText(
                    "Bonjour,\n\n" +
                            "Vous avez demandé la réinitialisation de votre mot de passe.\n" +
                            "Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :\n\n" +
                            resetLink + "\n\n" +
                            "Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.\n\n" +
                            "RestoMap"
            );

            sendViaGmailApi(message);
            log.info("E-mail de réinitialisation envoyé via l'API Gmail à : {}", toEmail);
        } catch (Exception e) {
            log.error("Échec de l'envoi de l'e-mail de réinitialisation : {}", e.getMessage());
            throw new RuntimeException("Échec de l'envoi de l'e-mail de réinitialisation", e);
        }
    }

    @Async
    public void sendPasswordChangedEmail(String toEmail) {
        try {
            MimeMessage message = createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(fromEmail, "RestoMap No-Reply"));
            helper.setTo(toEmail);
            helper.setSubject("RestoMap - Votre mot de passe a été modifié");
            helper.setText(
                    "Bonjour,\n\n" +
                            "Nous vous confirmons que votre mot de passe RestoMap a été modifié avec succès.\n\n" +
                            "Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter.\n\n" +
                            "RestoMap"
            );
            sendViaGmailApi(message);
            log.info("E-mail de confirmation de modification envoyé via l'API Gmail à : {}", toEmail);
        } catch (Exception e) {
            log.error("Échec de l'envoi de l'e-mail de confirmation : {}", e.getMessage());
            throw new RuntimeException("Échec de l'envoi de l'e-mail de confirmation de modification", e);
        }
    }

    private MimeMessage createMimeMessage() {
        Session session = Session.getInstance(new Properties());
        return new MimeMessage(session);
    }

    private void sendViaGmailApi(MimeMessage mimeMessage) throws Exception {
        String accessToken = getAccessToken();
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        mimeMessage.writeTo(buffer);
        String encodedEmail = Base64.getUrlEncoder().encodeToString(buffer.toByteArray());
        Map<String, String> body = Map.of("raw", encodedEmail);

        restClient.post()
                .uri("https://gmail.googleapis.com/gmail/v1/users/me/messages/send")
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    private String getAccessToken() {
        try {
            Map<String, String> params = Map.of(
                    "client_id", clientId,
                    "client_secret", clientSecret,
                    "refresh_token", refreshToken,
                    "grant_type", "refresh_token"
            );

            Map<String, Object> response = restClient.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .header("Content-Type", "application/json")
                    .body(params)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("access_token")) {
                return (String) response.get("access_token");
            }
            throw new RuntimeException("Impossible d'extraire l'access_token Google");
        } catch (Exception e) {
            log.error("Erreur lors de l'authentification OAuth Google : {}", e.getMessage());
            throw new RuntimeException("Échec de l'authentification OAuth Google", e);
        }
    }
}
