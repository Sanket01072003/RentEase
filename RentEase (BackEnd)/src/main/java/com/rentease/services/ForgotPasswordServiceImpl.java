package com.rentease.services;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rentease.dtos.ForgotPasswordDTO;
import com.rentease.dtos.ResetPasswordDTO;
import com.rentease.dtos.ResponseDto;
import com.rentease.entities.Owner;
import com.rentease.entities.Renter;
import com.rentease.exceptions.CustomException;
import com.rentease.repositories.OwnerRepository;
import com.rentease.repositories.RenterRepository;
import com.rentease.security.OtpStore;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

	private final OwnerRepository ownerRepository;
	private final RenterRepository renterRepository;
	private final EmailService emailService;
	private final OtpStore otpStore;
	private final PasswordEncoder passwordEncoder;

	// ── Step 1: Send OTP ──────────────────────────────────
	@Override
	public ResponseDto sendOtp(ForgotPasswordDTO dto) {

		String mail = dto.getMail();

		// Check if mail exists in owners or renters
		boolean ownerExists = ownerRepository.existsByMail(mail);
		boolean renterExists = renterRepository.existsByMail(mail);

		if (!ownerExists && !renterExists) {
			throw new CustomException("No account found with this email!");
		}

		// Generate 6 digit OTP
		String otp = String.valueOf(100000 + new Random().nextInt(900000));

		// Save OTP in memory
		otpStore.saveOtp(mail, otp);

		// Send OTP via email
		emailService.sendOtp(mail, otp);

		return new ResponseDto("OTP sent to " + mail, "Success", LocalDateTime.now(), null);
	}

	// ── Step 2: Reset Password ────────────────────────────
	@Override
	public ResponseDto resetPassword(ResetPasswordDTO dto) {

		String mail = dto.getMail();

		// Check OTP exists
		if (!otpStore.hasOtp(mail)) {
			throw new CustomException("OTP expired or not requested!");
		}

		// Validate OTP
		String savedOtp = otpStore.getOtp(mail);
		if (!savedOtp.equals(dto.getOtp())) {
			throw new CustomException("Invalid OTP!");
		}

		// Encode new password
		String encodedPassword = passwordEncoder.encode(dto.getNewPassword());

		// Update in owners table if found
		Owner owner = ownerRepository.findByMail(mail).orElse(null);
		if (owner != null) {
			owner.setPassword(encodedPassword);
			ownerRepository.save(owner);
		}

		// Update in renters table if found
		Renter renter = renterRepository.findByMail(mail).orElse(null);
		if (renter != null) {
			renter.setPassword(encodedPassword);
			renterRepository.save(renter);
		}

		// Delete OTP after use
		otpStore.deleteOtp(mail);

		return new ResponseDto("Password Reset Successfully!", "Success", LocalDateTime.now(), null);
	}
}