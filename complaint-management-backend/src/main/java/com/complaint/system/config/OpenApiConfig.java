package com.complaint.system.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()

                .info(new Info()
                        .title("Complaint Registration System API")
                        .version("1.0")
                        .description(
                                "Complaint Registration and Management System API"
                        )
                        .contact(new Contact()
                                .name("Complaint Management Team")
                        )
                )

                .components(
                        new Components()
                                .addSecuritySchemes(
                                        "bearerAuth",
                                        new SecurityScheme()
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                )

                // IMPORTANT:
                // Tell Swagger that APIs require JWT
                .addSecurityItem(
                        new SecurityRequirement()
                                .addList("bearerAuth")
                );
    }
}