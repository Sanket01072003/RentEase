package com.rentease.entities;

import java.util.List;

import com.rentease.ENUMs.UserRole;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Renter")
@Getter
@Setter
@NoArgsConstructor
//@ToString(exclude = {"cart" , "userDetails"})
@AttributeOverride(name = "id" , column = @Column(name = "renter_id"))
@ToString
public class Renter extends User {
	
//	@JoinColumn(name = "buyer_id" , nullable = false)
//	@MapsId
//	private User userDetails;
//	
//	@OneToMany
//	@JoinColumn(name = "product_id")
//	private List<Products> cart;
	
//	@Column(nullable = false)
//	private String address;

	public Renter(Long id, String name, String mail, String password, String phone) {
		super(id, name, mail, password, phone);
//		this.address = address;
		this.setRole(UserRole.RENTER);
	}

}
