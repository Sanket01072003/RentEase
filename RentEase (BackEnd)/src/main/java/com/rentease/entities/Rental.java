package com.rentease.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rentease.ENUMs.RentalStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "rentals")           
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"product", "renter", "review", "payment"})
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rental_id")
    private Long rentalId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;      

    @ManyToOne
    @JoinColumn(name = "renter_id", nullable = false)
    private Renter renter;         

    @OneToOne
    @JoinColumn(name = "review_id")
    @JsonIgnore
    private Review review;        

//    @OneToOne
//    @JoinColumn(name = "payment_id")
//    private Payment payment;    
    
    @Column(name = "payment_id")
    private Long paymentId;

    @Column(nullable = false, name = "from_date")
    private LocalDate fromDate;

    @Column(nullable = false, name = "to_date")
    private LocalDate toDate;

    @Column(nullable = false, name = "total_rent")
    private double totalRent;

    @Column(nullable = false, name = "deposit_amount")
    private double depositAmount;  

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "rental_status")
    private RentalStatus status;   

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt; 
}