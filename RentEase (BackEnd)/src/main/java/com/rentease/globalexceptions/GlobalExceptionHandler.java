package com.rentease.globalexceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.rentease.dtos.ResponseDto;
import com.rentease.exceptions.CustomException;
import com.rentease.exceptions.DuplicateException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<?> handleCustomException(CustomException e) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND) // ✅ fixed
				.body(new ResponseDto(e.getMessage(), "Failed", LocalDateTime.now(), null));
	}

	@ExceptionHandler(DuplicateException.class)
	public ResponseEntity<?> handleDuplicateException(DuplicateException e) {
		return ResponseEntity.status(HttpStatus.CONFLICT)
				.body(new ResponseDto(e.getMessage(), "Failed", LocalDateTime.now(), null));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException e) {

		// ✅ collect all field errors
		Map<String, String> errors = new HashMap<>();
		e.getBindingResult().getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

		// ✅ send errors map in response
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ResponseDto("Validation Failed", "Failed", LocalDateTime.now(), errors)); // ✅ errors included
																									// now
	}

	// ✅ Added generic exception handler
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGenericException(Exception e) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ResponseDto("Something went wrong: " + e.getMessage(), "Failed", LocalDateTime.now(), null));
	}
}