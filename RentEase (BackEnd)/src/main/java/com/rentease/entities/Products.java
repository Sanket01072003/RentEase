package com.rentease.entities;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import com.rentease.ENUMs.Availability;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Products {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "product_id")
	private Long productId;

	@Column(nullable = false, name = "product_name")
	private String productName;

	@Column(nullable = false)
	private String description;

	@Column(nullable = false, name = "price_per_day")
	private double pricePerDay;

	@Column(nullable = false, name = "deposit_amount")
	private double depositAmount;

	@Column(name = "image_url")
	private String imageUrl;

	@ManyToOne
	@JoinColumn(name = "owner_id", nullable = false)
	private Owner owner;

	@ManyToOne
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Availability status;

	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public Products(Long productId, String productName, String description, double pricePerDay, double depositAmount,
			String imageUrl, String status) {
		this.productId = productId;
		this.productName = productName;
		this.description = description;
		this.pricePerDay = pricePerDay;
		this.depositAmount = depositAmount;
		this.imageUrl = imageUrl;
		this.status = Availability.valueOf(status);
	}
}