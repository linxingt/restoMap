package com.restomap.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RestomapBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestomapBackendApplication.class, args);
	}

}
