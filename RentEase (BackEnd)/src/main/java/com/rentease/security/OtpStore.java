package com.rentease.security;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class OtpStore {

    // mail → otp
    private final Map<String, String> otpMap = new HashMap<>();

    public void saveOtp(String mail, String otp) {
        otpMap.put(mail, otp);
    }

    public String getOtp(String mail) {
        return otpMap.get(mail);
    }

    public void deleteOtp(String mail) {
        otpMap.remove(mail);
    }

    public boolean hasOtp(String mail) {
        return otpMap.containsKey(mail);
    }
}