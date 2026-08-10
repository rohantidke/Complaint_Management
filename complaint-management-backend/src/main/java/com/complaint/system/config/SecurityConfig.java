package com.complaint.system.config;

import com.complaint.system.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http

                // Enable CORS configuration source
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // Disable CSRF because this is a REST API
                .csrf(csrf -> csrf.disable())

                // JWT authentication is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Disable request cache
                .requestCache(requestCache ->
                        requestCache.disable()
                )

                .authorizeHttpRequests(auth -> auth
    // React frontend (served by Spring Boot)
    .requestMatchers(
        "/", 
        "/index.html", 
        "/favicon.ico", 
        "/favicon.svg", 
        "/icons.svg", 
        "/assets/**", 
        "/*.js", 
        "/*.css"
    ).permitAll()

    // Public endpoints
    .requestMatchers(
        "/api/auth/**", 
        "/api/health",
        "/actuator/**",
        "/swagger-ui/**", 
        "/swagger-ui.html", 
        "/v3/api-docs/**", 
        "/error"
    ).permitAll()

    // Admin APIs
    .requestMatchers("/api/admin/**").hasRole("ADMIN")

    // Staff APIs
    .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN")

    // Complaint APIs
    .requestMatchers("/api/complaints/**").hasAnyRole("USER", "STAFF", "ADMIN")

    // Everything else requires login
    .anyRequest().authenticated()
)


                // JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
