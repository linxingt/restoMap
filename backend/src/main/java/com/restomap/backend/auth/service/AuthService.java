package com.restomap.backend.auth.service;

import com.restomap.backend.common.exception.AccountBlockedException;
import com.restomap.backend.common.exception.BadCredentialsException;
import com.restomap.backend.common.exception.BusinessException;
import com.restomap.backend.common.exception.ResourceNotFoundException;
import com.restomap.backend.auth.dto.UserDTO;
import com.restomap.backend.user.entity.User;
import com.restomap.backend.user.repository.UserRepository;
import com.restomap.backend.common.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xbill.DNS.Lookup;
import org.xbill.DNS.Record;
import org.xbill.DNS.Type;

import java.security.SecureRandom;
import java.util.Date;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public UserDTO.AuthResponse register(UserDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Cet email est déjà utilisé");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("USER");
        userRepository.save(user);
        log.info("Nouvel utilisateur inscrit avec succès : {}", user.getEmail());
        return new UserDTO.AuthResponse(null, null, "Inscription réussie");
    }

    public UserDTO.AuthResponse login(UserDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.email()).orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            log.warn("Tentative de connexion échouée pour : {}", request.email());
            throw new BadCredentialsException("Mot de passe incorrect");
        }

        if (user.getLockoutUntil() != null && new Date().before(user.getLockoutUntil())) {
            long minutesLeft = (user.getLockoutUntil().getTime() - System.currentTimeMillis()) / (1000 * 60);
            throw new AccountBlockedException("Compte temporairement bloqué. Veuillez réessayer dans " + (minutesLeft + 1) + " minute(s).");
        }

        boolean needsVerification = true;
        if (user.getLastVerifiedAt() != null) {
            long hoursElapsed = (System.currentTimeMillis() - user.getLastVerifiedAt().getTime()) / (1000 * 60 * 60);
            if (hoursElapsed < 24) {
                needsVerification = false;
            }
        }

        if (needsVerification) {
            if (!isValidEmailDomain(user.getEmail())) {
                log.warn("Tentative d'utilisation d'un domaine d'e-mail invalide : {}", user.getEmail());
                throw new BusinessException("Le domaine de l'e-mail est introuvable ou invalide.");
            }
            String code = generateRandomCode();
            user.setVerificationCode(code);
            userRepository.save(user);
            try {
                emailService.sendVerificationEmail(user.getEmail(), code);
            } catch (Exception e) {
                throw new RuntimeException("Échec de l'envoi de l'e-mail de vérification : " + e.getMessage());
            }
            log.info("Code de vérification envoyé à : {}", user.getEmail());
            return new UserDTO.AuthResponse(null, user.getUsername(), "CODE_REQUIRED");
        } else {
            String jwtToken = jwtService.generateToken(user.getEmail());
            log.info("Connexion directe (moins de 24h) pour : {}", user.getEmail());
            return new UserDTO.AuthResponse(jwtToken, user.getUsername(), "Connexion réussie");
        }
    }

    @Transactional(noRollbackFor = {BadCredentialsException.class})
    public UserDTO.AuthResponse verifyCode(UserDTO.VerifyCodeRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.code())) {
            int attempts = user.getVerificationFailedAttempts() + 1;
            user.setVerificationFailedAttempts(attempts);
            long freezeTimeMillis;
            String durationMessage;
            if (attempts == 1) {
                freezeTimeMillis = 10 * 60 * 1000L;
                durationMessage = "10 minutes";
            } else if (attempts == 2) {
                freezeTimeMillis = 30 * 60 * 1000L;
                durationMessage = "30 minutes";
            } else {
                freezeTimeMillis = 60 * 60 * 1000L;
                durationMessage = "1 heure";
            }
            user.setLockoutUntil(new Date(System.currentTimeMillis() + freezeTimeMillis));
            userRepository.save(user);
            throw new BadCredentialsException("Code incorrect. Vous pourrez demander un nouveau code de vérification dans " + durationMessage + " suite à cet échec.");
        }

        user.setLastVerifiedAt(new Date());
        user.setVerificationCode(null);
        user.setVerificationFailedAttempts(0);
        user.setLockoutUntil(null);
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());
        log.info("Vérification du code réussie pour : {}", user.getEmail());
        return new UserDTO.AuthResponse(jwtToken, user.getUsername(), "Connexion réussie");
    }

    private String generateRandomCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private boolean isValidEmailDomain(String email) {
        if (email == null || !email.contains("@")) {
            return false;
        }
        String domain = email.substring(email.indexOf("@") + 1);

        try {
            // MX: enregistrements DNS (quels serveurs de messagerie gèrent les e-mails pour ce domaine)
            Lookup mxLookup = new Lookup(domain, Type.MX);
            Record[] records = mxLookup.run();
            if (records != null && records.length > 0) {
                return true;
            }
            // A: enregistrement A (l'adresse IP associée au domaine)
            Lookup aLookup = new Lookup(domain, Type.A);
            Record[] aRecords = aLookup.run();
            return aRecords != null && aRecords.length > 0;
        } catch (Exception e) {
            log.warn("Erreur lors de la résolution DNS pour {} : {}", domain, e.getMessage());
            return false;
        }
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec cet email"));

        String token = generateRandomCode() + generateRandomCode();
        user.setResetToken(token);
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), token);
            log.info("E-mail de réinitialisation de mot de passe envoyé à : {}", user.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Échec de l'envoi de l'e-mail de réinitialisation : " + e.getMessage());
        }
    }

    @Transactional
    public void resetPassword(UserDTO.ResetPasswordRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new BusinessException("Les mots de passe ne correspondent pas");
        }

        User user = userRepository.findByResetToken(request.token())
                .orElseThrow(() -> new BusinessException("Token de réinitialisation invalide ou expiré"));

        user.setPassword(passwordEncoder.encode(request.password()));
        user.setResetToken(null);
        user.setVerificationFailedAttempts(0);
        user.setLockoutUntil(null);
        userRepository.save(user);

        try {
            emailService.sendPasswordChangedEmail(user.getEmail());
            log.info("Mot de passe modifié avec succès pour : {}", user.getEmail());
        } catch (Exception e) {
            log.warn("Erreur lors de l'envoi de l'e-mail de confirmation : {}", e.getMessage());
        }
    }
}
