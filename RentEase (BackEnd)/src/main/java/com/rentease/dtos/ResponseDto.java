package com.rentease.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDto<T> {
	private String message;
	private String status;
	private LocalDateTime timeStamp;
	private T data;
}
