package com.rentease.entities;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import com.rentease.ENUMs.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")        
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @Column(nullable = false, name = "razor_order_id")
    private String razorOrderId;   

    @Column(name = "razor_payment_id")
    private String razorPaymentId; 

    @Column(nullable = false, name = "total_amount")
    private double totalAmount;

    @Column(name = "deposit_refund_id")
    private String depositRefundId; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "payment_status")
    private PaymentStatus status;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt; 
}