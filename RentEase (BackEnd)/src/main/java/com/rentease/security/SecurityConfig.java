package com.rentease.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

            	    // ✅ Public
            	    .requestMatchers(
            	        "/owners/register",
            	        "/renters/register",
            	        "/auth/login",
            	        "/products/all",
            	        "/products/available",
            	        "/products/category/**",
            	        "/products/{id}", //remember to remove this line if required
            	        "/categories/all",
            	        "/categories/**"
            	    ).permitAll()

            	    // ✅ Owner only
            	    .requestMatchers(
            	        "/products/add",
            	        "/products/owner/**",
            	        "/rentals/*/return",
            	        "/owners/**",
            	        "/categories/add"
            	    ).hasRole("OWNER")

            	    // ✅ Renter only
            	    .requestMatchers(
            	        "/rentals/create",
            	        "/rentals/*/cancel",
            	        "/reviews/add",
            	        "/renters/**"
            	    ).hasRole("RENTER")

            	    // ✅ Logged in user (any role)
            	    .requestMatchers(
            	        "/products/**",
            	        "/rentals/**",
            	        "/reviews/**",
            	        "/payments/**"
            	    ).authenticated()

            	    // ✅ Everything else
            	    .anyRequest().authenticated()
            	)
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}