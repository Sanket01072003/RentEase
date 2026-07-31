package com.rentease.config;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

	@Bean //method level annotation - to declare a method returning java object
	 ModelMapper modelMapper()
	{
		ModelMapper mapper=new ModelMapper();
		//configure mapper - to transfer the matching props (name + data type)
		mapper.getConfiguration()
		.setMatchingStrategy(MatchingStrategies.STRICT)
		//configure mapper - not to transfer nulls from src -> dest
		.setPropertyCondition(Conditions.isNotNull());
		return mapper;//Method rets configured ModelMapper bean to SC
	}
	
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
//	
}
