package com.rentease.payment.controllers;

import com.rentease.payment.dtos.CreateOrderRequest;
import com.rentease.payment.dtos.RefundRequest;
import com.rentease.payment.dtos.VerifyPaymentRequest;
import com.rentease.payment.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// This whole controller is only ever called SERVER-TO-SERVER by the
// main RentEase backend (which itself sits behind Spring Security + JWT).
// This microservice does not do its own auth — that's a deliberate
// "internal service" design choice, common when a service is not
// directly internet-facing. (In production you'd still add network-level
// protection — e.g. only allow calls from the main backend's IP, or a
// shared internal API key header.)
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Valid @RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.verifyAndSave(request));
    }

    @PostMapping("/refund")
    public ResponseEntity<?> refund(@Valid @RequestBody RefundRequest request) {
        return ResponseEntity.ok(paymentService.refundDeposit(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getById(id));
    }

    @GetMapping("/rental/{rentalId}")
    public ResponseEntity<?> getByRentalId(@PathVariable Long rentalId) {
        return ResponseEntity.ok(paymentService.getByRentalId(rentalId));
    }
}
