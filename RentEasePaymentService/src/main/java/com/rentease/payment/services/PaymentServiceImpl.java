package com.rentease.payment.services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Refund;
import com.rentease.payment.dtos.CreateOrderRequest;
import com.rentease.payment.dtos.PaymentOrderResponse;
import com.rentease.payment.dtos.RefundRequest;
import com.rentease.payment.dtos.VerifyPaymentRequest;
import com.rentease.payment.entities.Payment;
import com.rentease.payment.entities.PaymentStatus;
import com.rentease.payment.exceptions.PaymentServiceException;
import com.rentease.payment.repositories.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HexFormat;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    // ── Step 1: Create Razorpay Order ─────────────────────
    // Main backend calls this; it sends the computed amounts
    // because this service has no access to the Rental table.
    @Override
    public PaymentOrderResponse createOrder(CreateOrderRequest request) {

        double amount = request.getTotalRent() + request.getDepositAmount();

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject options = new JSONObject();
            options.put("amount", (int) (amount * 100)); // paise
            options.put("currency", "INR");
            options.put("receipt", "rental_" + request.getRentalId());

            Order order = client.orders.create(options);

            return new PaymentOrderResponse(
                order.get("id"),
                amount,
                "INR",
                keyId,
                request.getRenterName(),
                request.getRenterMail()
            );

        } catch (RazorpayException e) {
            throw new PaymentServiceException(
                "Failed to create Razorpay order: " + e.getMessage());
        }
    }

    // ── Step 2: Verify & Save Payment ─────────────────────
    @Override
    public Payment verifyAndSave(VerifyPaymentRequest request) {

        boolean isValid = verifySignature(
                request.getRazorOrderId(),
                request.getRazorPaymentId(),
                request.getRazorSignature()
        );

        if (!isValid) {
            throw new PaymentServiceException(
                "Payment verification failed! Invalid signature.");
        }

        Payment payment = new Payment();
        payment.setRentalId(request.getRentalId());
        payment.setRazorOrderId(request.getRazorOrderId());
        payment.setRazorPaymentId(request.getRazorPaymentId());
        payment.setTotalAmount(request.getTotalAmount());
        payment.setStatus(PaymentStatus.SUCCESS);

        return paymentRepository.save(payment);
        // NOTE: Main backend is responsible for setting Rental.status = ACTIVE
        // and Product.status = RENTED after this call succeeds — this service
        // only owns Payment data, not Rental/Product data.
    }

    // ── Step 3: Refund Deposit ─────────────────────────────
    @Override
    public Payment refundDeposit(RefundRequest request) {

        Payment payment = paymentRepository.findByRentalId(request.getRentalId())
                .orElseThrow(() ->
                    new PaymentServiceException("No payment found for this rental!"));

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject refundOptions = new JSONObject();
            refundOptions.put("amount", (int) (request.getDepositAmount() * 100));

            Refund refund = client.payments.refund(
                    payment.getRazorPaymentId(), refundOptions);

            payment.setDepositRefundId(refund.get("id"));
            payment.setStatus(PaymentStatus.REFUNDED);

            return paymentRepository.save(payment);

        } catch (RazorpayException e) {
            throw new PaymentServiceException("Refund failed: " + e.getMessage());
        }
    }

    @Override
    public Payment getById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentServiceException("Payment not found!"));
    }

    @Override
    public Payment getByRentalId(Long rentalId) {
        return paymentRepository.findByRentalId(rentalId)
                .orElseThrow(() -> new PaymentServiceException(
                    "No payment found for rental " + rentalId));
    }

    // ── HMAC Signature Verification ────────────────────────
    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String data = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(keySecret.getBytes(), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes());
            String generated = HexFormat.of().formatHex(hash);
            return generated.equals(signature);
        } catch (Exception e) {
            throw new PaymentServiceException("Signature verification error: " + e.getMessage());
        }
    }
}
