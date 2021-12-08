package com.nashtech.assetmanagementwebservice;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
@EnableTransactionManagement
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class AssetManagementWebServiceApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(AssetManagementWebServiceApplication.class, args);
	}

}
