package com.rentease.security;

import com.rentease.dtos.LogDto;
import com.rentease.services.LoggerClientService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class LoggingFilter extends OncePerRequestFilter {

    private final LoggerClientService loggerClientService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();

        // Wrap request/response to read body without consuming stream
        ContentCachingRequestWrapper wrappedRequest =
                new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse =
                new ContentCachingResponseWrapper(response);

        // Continue with actual request
        filterChain.doFilter(wrappedRequest, wrappedResponse);

        long duration = System.currentTimeMillis() - startTime;

        // Get logged-in user info (if available)
        String userMail = null;
        String userRole = null;
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                userMail = auth.getName();
                userRole = auth.getAuthorities().stream()
                        .findFirst().map(Object::toString).orElse(null);
            }
        } catch (Exception ignored) {}

        // Build log
        LogDto log = new LogDto(
                "RentEase-Backend",
                request.getMethod(),
                request.getRequestURI(),
                wrappedResponse.getStatus(),
                userMail,
                userRole,
                getRequestBody(wrappedRequest),
                "Handled",
                duration
        );

        // Send to .NET logger (async, non-blocking)
        loggerClientService.sendLog(log);

        // IMPORTANT: copy body back so response actually reaches client
        wrappedResponse.copyBodyToResponse();
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] buf = request.getContentAsByteArray();
        if (buf.length == 0) return null;
        String body = new String(buf, StandardCharsets.UTF_8);
        return body.length() > 500 ? body.substring(0, 500) : body;
    }
}