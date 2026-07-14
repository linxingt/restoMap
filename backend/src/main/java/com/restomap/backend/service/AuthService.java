package com.restomap.backend.service;

import com.restomap.backend.dto.UserDTO;
import com.restomap.backend.entity.User;
import com.restomap.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserDTO.AuthResponse register(UserDTO.RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("USER");
        user.setCreatedAt(new Date());

        userRepository.save(user);

        return new UserDTO.AuthResponse(null,null, "Inscription réussie");
    }

    public UserDTO.AuthResponse login(UserDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (passwordEncoder.matches(request.password(), user.getPassword())) {
            String jwtToken = jwtService.generateToken(user.getEmail());
            return new UserDTO.AuthResponse(jwtToken, user.getUsername(),"Connexion réussie");
        } else {
            throw new RuntimeException("Mot de passe incorrect");
        }
    }
}
