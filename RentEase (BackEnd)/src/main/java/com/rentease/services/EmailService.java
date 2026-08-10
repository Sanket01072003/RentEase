package com.rentease.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String fromMail; // ✅ reads from properties

	public void sendOtp(String toMail, String otp) {

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(fromMail); // ✅ set sender
		message.setTo(toMail);
		message.setSubject("RentEase — Password Reset OTP");
		message.setText("Hello!\n\n" + "Your OTP for password reset is: \n\n" + "         " + otp + "\n\n"
				+ "This OTP is valid for 10 minutes.\n\n" + "If you did not request this, "
				+ "please ignore this email.\n\n" + "Regards,\n" + "Team RentEase");

		mailSender.send(message);
	}
}