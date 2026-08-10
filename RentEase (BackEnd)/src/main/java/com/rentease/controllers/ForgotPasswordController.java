package com.rentease.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rentease.dtos.ForgotPasswordDTO;
import com.rentease.dtos.ResetPasswordDTO;
import com.rentease.services.ForgotPasswordService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    // Step 1: Send OTP to email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> sendOtp(
            @RequestBody ForgotPasswordDTO dto) {
        return ResponseEntity.ok(
                forgotPasswordService.sendOtp(dto));
    }

    // Step 2: Verify OTP and reset password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordDTO dto) {
        return ResponseEntity.ok(
                forgotPasswordService.resetPassword(dto));
    }
}