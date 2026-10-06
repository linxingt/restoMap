package com.restomap.backend.auth.service;

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


@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
        if (passwordEncoder.matches(request.password(), user.getPassword())) {
            String jwtToken = jwtService.generateToken(user.getEmail());
            log.info("Utilisateur connecté : {}", user.getEmail());
            return new UserDTO.AuthResponse(jwtToken, user.getUsername(),"Connexion réussie");
        } else {
            log.warn("Tentative de connexion échouée pour : {}", request.email());
            throw new BusinessException("Mot de passe incorrect");
        }
    }
}
