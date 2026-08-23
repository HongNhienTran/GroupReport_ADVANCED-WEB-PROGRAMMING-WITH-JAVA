package com.thesweetlabbe.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI sweetLabOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("The Sweet Lab - RESTful API Documentation")
                        .description("Hệ thống API cho nền tảng thương mại điện tử bánh kẹo/socola healthy The Sweet Lab tích hợp tư vấn dinh dưỡng và AI.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("The Sweet Lab Team")
                                .email("contact@thesweetlab.com"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Nhập Access Token vào đây theo cú pháp: <your_token>")));
    }
}
