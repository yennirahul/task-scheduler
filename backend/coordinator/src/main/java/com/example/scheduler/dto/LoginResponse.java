package com.example.scheduler.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private String id;
    private String username;
    private String fullName;
    private String email;
    private String role;
}
