package com.complaint.system.security;

import com.complaint.system.entity.User;
import com.complaint.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        // No JWT
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authHeader.substring(7);

        try {

            // Validate JWT
            if (!jwtService.isTokenValid(token)) {

                SecurityContextHolder.clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // Extract email
            String email =
                    jwtService.extractEmail(token);

            if (email == null) {

                SecurityContextHolder.clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // Don't authenticate twice
            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                User user =
                        userRepository
                                .findByEmail(email)
                                .orElseThrow(() ->
                                        new UsernameNotFoundException(
                                                "User not found: " + email
                                        )
                                );

                String role =
                        "ROLE_" +
                                user.getRole().name();

                UsernamePasswordAuthenticationToken
                        authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                role
                                        )
                                )
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }

        } catch (Exception e) {

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}