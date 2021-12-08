package com.nashtech.assetmanagementwebservice.exception;

import org.aspectj.weaver.ast.Not;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import javax.naming.AuthenticationException;
import javax.persistence.EntityNotFoundException;


@RestControllerAdvice
public class CustomExceptionHandler {
    Logger logger = LoggerFactory.getLogger(CustomExceptionHandler.class);

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handlerNotFoundException(NotFoundException ex, WebRequest req) {
        logger.error("Not Found Exception", ex);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateRecordException.class)
    public ResponseEntity<?> handlerDuplicateRecordException(DuplicateRecordException ex, WebRequest req) {
        logger.error("Handle Duplicate Record Exception", ex);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<?> handlerInternalServerException(InternalServerException ex, WebRequest req) {
        logger.error("Internal Server Exception", ex);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Xử lý tất cả các exception chưa được khai báo
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handlerException(Exception ex, WebRequest req) {
        logger.error("handler exception", ex);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBussinessException(BusinessException ex, WebRequest req) {
        logger.error("handle Bussiness Exception", ex);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequestException(BadRequestException ex, WebRequest req) {
        logger.error("handle Bad Request Exception", ex);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFound(EntityNotFoundException ex, WebRequest req) {
        logger.error("handle Entity Not Found Exception", ex);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<?> handleDisabledUserException(DisabledException ex, WebRequest req) {
        logger.error("handle Disabled User Exception", ex);
        return new ResponseEntity<>("Account Disabled", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentialsException(BadCredentialsException ex, WebRequest req) {
        logger.error("handle Bad Credentials Exception", ex);
        return new ResponseEntity<>("Bad Credentials", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleInvalidCredentialsException(AuthenticationException ex, WebRequest req) {
        logger.error("handle Authentication Exception", ex);
        return new ResponseEntity<>("Login failed", HttpStatus.UNAUTHORIZED);
    }
}
