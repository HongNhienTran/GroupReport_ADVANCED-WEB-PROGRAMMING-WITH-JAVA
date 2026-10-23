package com.thesweetlabbe;

import com.thesweetlabbe.config.EnvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TheSweetLabBeApplication {

	public static void main(String[] args) {
		EnvLoader.load();
		SpringApplication.run(TheSweetLabBeApplication.class, args);
	}

}
