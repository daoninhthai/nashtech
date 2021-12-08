package com.nashtech.assetmanagementwebservice.service.util;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordBcryptUtil {


    public static void main(String[] args) {
    	System.out.println(passwordEncoder("devacc@11111111"));
    	
//        String plantTextPassword ="admin@123";
//        System.out.println(passwordEncoder(plantTextPassword));
//        System.out.println("Matching or not :"+checkPasswordMatching(plantTextPassword,"$2a$10$RXZ26G5kPqrI6Otof1Nxq.NKUzHwj/TH84A2u0rq69fFQY1mOsrnO"));
    }
    public static String passwordEncoder(String plantTextPassword){
        if(StringUtils.isBlank(plantTextPassword)){
            throw new IllegalArgumentException("Input password should be not empty");

        }
        BCryptPasswordEncoder encoder= new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(plantTextPassword);
        return encodedPassword;
    }

    public static boolean checkPasswordMatching(String plainTextPassword,String encodedPassword){
        if(StringUtils.isBlank(plainTextPassword) || StringUtils.isBlank(encodedPassword)){
            throw new IllegalArgumentException("Input should be empty...");
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return  encoder.matches(plainTextPassword,encodedPassword);
    }
}
