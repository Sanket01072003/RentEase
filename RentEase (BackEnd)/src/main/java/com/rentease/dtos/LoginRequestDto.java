package com.rentease.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LoginRequestDto {
	@NotBlank(message = "Email is required")
	@Email(message = "Enter Email in Proper format")
	private String mail;
	@NotBlank(message = "Password is Required")
	private String password;
}
