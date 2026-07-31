package com.rentease.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUser {
	@NotBlank(message = "Name is Required")
	private String name;
	@NotBlank(message = "Email is required")
	@Email(message = "Enter Email in Proper format")
    private String mail;
	@NotBlank(message = "Password is Required")
    private String password;
	@NotBlank(message = "Phone is Required")
    private String phone;
	
    private String address;
}
