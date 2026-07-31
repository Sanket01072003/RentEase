package com.rentease.services;

import com.rentease.dtos.LoginRequestDto;
import com.rentease.dtos.RegisterUser;
import com.rentease.dtos.ResponseDto;

public interface LoginService {

	ResponseDto loginUser(LoginRequestDto loginRequest);

}
