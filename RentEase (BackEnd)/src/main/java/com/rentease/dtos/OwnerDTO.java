package com.rentease.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class OwnerDTO {
	private String name;
    private String mail;
    private String password;
    private String phone;
}
