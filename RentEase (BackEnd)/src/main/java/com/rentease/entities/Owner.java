package com.rentease.entities;

import com.rentease.ENUMs.UserRole;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Owner")
@Getter
@Setter
@NoArgsConstructor
@AttributeOverride(name = "id" , column = @Column(name = "owner_id"))
//@ToString(exclude = { "userDetails"})
@ToString
public class Owner extends User{
		
//	@JoinColumn(name = "owner_id" , nullable = false)
//	@MapsId
//	private User userDetails;
	
//	@OneToMany
//	@JoinColumn(name = "product_id")
//	private List<Products> products;

	public Owner(Long id, String name, String mail, String password, String phone ) {
		super(id, name, mail, password, phone);
		this.setRole(UserRole.OWNER);
	}
	
}
