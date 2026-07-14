package com.restomap.backend.dto;

public class UserDTO {
    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token, String username, String message) {}
}
