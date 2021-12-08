package com.nashtech.assetmanagementwebservice.exception;

public class BadRequestException extends RuntimeException{
    public BadRequestException(String msg) {
        super(msg);
    }
}
