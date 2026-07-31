package com.rentease.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.rentease.ENUMs.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@ToString
public class User {
	public User(Long id, String name, String mail, String password, String phone) {
		super();
		this.id = id;
		this.name = name;
		this.mail = mail;
		this.password = password;
		this.phone = phone;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String name;
	
	@Column(unique = true , nullable = false)
	private String mail;
	
	@Column( nullable = false)
	private String password;
	
	@Column(unique = true , nullable = false)
	private String phone;
	
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private UserRole role;
	
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	@UpdateTimestamp
	private LocalDateTime updatedAt;
	
}
