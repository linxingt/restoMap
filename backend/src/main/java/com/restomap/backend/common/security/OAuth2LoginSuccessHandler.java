package com.restomap.backend.common.security;

import com.restomap.backend.user.entity.User;
import com.restomap.backend.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private static final Logger log = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${cors.allowed-origin}")
    private String allowedOrigin;

    public OAuth2LoginSuccessHandler(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");

            if (email == null) {
                throw new IllegalStateException("Email introuvable depuis le profil Google");
            }

            if (name == null) {
                name = email.split("@")[0];
            }

            String finalName = name;
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(finalName);
                newUser.setPassword(""); // Pas de mot de passe requis pour OAuth2
                newUser.setRole("USER");
                return userRepository.save(newUser);
            });

            String token = jwtService.generateToken(user.getEmail());

            String targetUrl = String.format("%s?token=%s&username=%s",
                    allowedOrigin,
                    URLEncoder.encode(token, StandardCharsets.UTF_8),
                    URLEncoder.encode(user.getUsername(), StandardCharsets.UTF_8)
            );

            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } catch (Exception e) {
            log.error("Erreur critique lors de l'authentification OAuth2 Google : {}", e.getMessage(), e);

            String errorUrl = String.format("%s?error=%s", allowedOrigin, URLEncoder.encode("Échec de la connexion Google", StandardCharsets.UTF_8));
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
        }
    }
}
