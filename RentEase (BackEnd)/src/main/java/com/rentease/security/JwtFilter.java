package com.rentease.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Get Authorization header
        String authHeader = request.getHeader("Authorization");

        // Check if header exists and starts with Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token = authHeader.substring(7);

        // Validate token
        if (!jwtService.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract mail and role
        String mail = jwtService.extractMail(token);
        String role = jwtService.extractRole(token);

        // Set authentication in SecurityContext
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                mail,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}