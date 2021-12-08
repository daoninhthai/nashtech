package com.nashtech.assetmanagementwebservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
	@Bean
	public Docket apiV1() {
		String version = "v1";
		return new Docket(DocumentationType.SWAGGER_2)
				.apiInfo(apiInfo())
				.groupName(version)
				.select()
				.apis(RequestHandlerSelectors.any())

				.paths(PathSelectors.regex(".*/" + version + "/.*"))
				.build();

	}

	private ApiInfo apiInfo() {
		return new ApiInfoBuilder()
				.title("uwu")
				.description("uwu")
				.contact(new Contact("Thái", "", "thaimeo1131@gmail.com"))
				.build();
	}

	@RequestMapping(value = "/api", method = RequestMethod.GET)
	public ModelAndView redirect() {
		return new ModelAndView("redirect:/swagger-ui.html");
	}

	@RequestMapping(value = "/api", method = RequestMethod.GET)
	public ModelAndView redirectApi() {
		return new ModelAndView("redirect:/swagger-ui.html");
	}

	@RequestMapping(value = "/doc", method = RequestMethod.GET)
	public ModelAndView redirectDoc() {
		return new ModelAndView("redirect:/swagger-ui.html");
	}
}
