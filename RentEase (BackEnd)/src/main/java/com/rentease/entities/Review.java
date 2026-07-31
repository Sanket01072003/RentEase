package com.rentease.entities;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")          
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;

    @ManyToOne
    @JoinColumn(name = "renter_id", nullable = false)
    private Renter renter;         

    @ManyToOne
    @JoinColumn(name = "rental_id", nullable = false)
    private Rental rental;         

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt; 
}