package com.restomap.backend.auth.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    SimpleMailMessage message = new SimpleMailMessage();
    @Value("${spring.mail.username}")
    private String fromEmail;
    @Value("${cors.allowed-origin}")
    private String allowedOrigin;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
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

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Échec de l'envoi de l'e-mail de vérification", e);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
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

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Échec de l'envoi de l'e-mail de réinitialisation", e);
        }
    }

    public void sendPasswordChangedEmail(String toEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
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
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Échec de l'envoi de l'e-mail de confirmation de modification", e);
        }
    }
}
