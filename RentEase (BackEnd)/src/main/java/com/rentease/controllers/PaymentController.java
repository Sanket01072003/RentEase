package com.rentease.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rentease.dtos.VerifyPaymentRequestDto;
import com.rentease.services.PaymentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    // Step 1: React calls this to get Razorpay order
    @GetMapping("/create-order/{rentalId}")
    public ResponseEntity<?> createOrder(
            @PathVariable Long rentalId) {
        return ResponseEntity.ok(
                paymentService.createOrder(rentalId));
    }

    // Step 2: React calls this after payment success
    @PostMapping("/verify")
    public ResponseEntity<?> verify(
            @RequestBody VerifyPaymentRequestDto dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.verifyAndSave(dto));
    }

    // Step 3: Owner confirms return — triggers deposit refund
    @PostMapping("/refund/{rentalId}")
    public ResponseEntity<?> refund(
            @PathVariable Long rentalId) {
        return ResponseEntity.ok(
                paymentService.refundDeposit(rentalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                paymentService.getByRentalId(id));
    }
}