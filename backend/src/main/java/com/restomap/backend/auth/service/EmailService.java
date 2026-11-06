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
}
