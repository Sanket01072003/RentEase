package com.rentease.services;

import com.rentease.dtos.ForgotPasswordDTO;
import com.rentease.dtos.ResetPasswordDTO;
import com.rentease.dtos.ResponseDto;

public interface ForgotPasswordService {
    ResponseDto sendOtp(ForgotPasswordDTO dto);
    ResponseDto resetPassword(ResetPasswordDTO dto);
}