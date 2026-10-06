package com.restomap.backend.auth.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTO {
    public record RegisterRequest(
            @NotBlank(message = "Le nom d'utilisateur est obligatoire")
            String username,

            @NotBlank(message = "L'email est obligatoire")
            @Email(message = "Format d'email invalide")
            String email,

            @NotBlank(message = "Le mot de passe est obligatoire")
            @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
            String password
    ) {}

    public record LoginRequest(
            @NotBlank(message = "L'email est obligatoire")
            @Email(message = "Format d'email invalide")
            String email,

            @NotBlank(message = "Le mot de passe est obligatoire")
            String password
    ) {}
    public record AuthResponse(String token, String username, String message) {}
    public record UserResponse(String id, String username, String role) {}
}
