package com.trip.companion.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("jwt")
public class JwtConfiguration {

    private String secret;
    private Long accessTokenExpirationInMs;
    private Long refreshTokenExpirationInMs;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public Long getAccessTokenExpirationInMs() {
        return accessTokenExpirationInMs;
    }

    public void setAccessTokenExpirationInMs(Long accessTokenExpirationInMs) {
        this.accessTokenExpirationInMs = accessTokenExpirationInMs;
    }

    public Long getRefreshTokenExpirationInMs() {
        return refreshTokenExpirationInMs;
    }

    public void setRefreshTokenExpirationInMs(Long refreshTokenExpirationInMs) {
        this.refreshTokenExpirationInMs = refreshTokenExpirationInMs;
    }

}
