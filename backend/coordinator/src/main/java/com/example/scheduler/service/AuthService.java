package com.example.scheduler.service;

import com.example.scheduler.dto.AuthResponse;
import com.example.scheduler.dto.LoginRequest;
import com.example.scheduler.dto.LoginResponse;
import com.example.scheduler.dto.RegisterRequest;
import com.example.scheduler.entity.User;
import com.example.scheduler.repository.UserRepository;
import com.example.scheduler.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;

    public LoginResponse login(LoginRequest request, String ipAddress) {
        // Allow login with either username or email
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid credentials"));

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!matches) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        auditLogService.logAction(user.getUsername(), "USER_LOGIN", "User", user.getId(), "User logged in successfully", ipAddress);
        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse register(RegisterRequest request, String ipAddress) {
        // Validate uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT, "Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT, "Email already registered");
        }
        // Create new user with VIEWER role by default
        User newUser = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("VIEWER")
                .enabled(true)
                .build();
        User saved = userRepository.save(newUser);
        // Log registration
        auditLogService.logAction(saved.getUsername(), "USER_REGISTER", "User", saved.getId(), "User registered", ipAddress);
        // Generate token for immediate login
        String token = jwtService.generateToken(saved.getUsername(), saved.getRole());
        return new AuthResponse(token, saved.getUsername(), saved.getEmail(), saved.getFullName(), saved.getRole());
    }
}
