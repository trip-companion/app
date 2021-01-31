package com.trip.companion.security;

import com.trip.companion.domain.user.Permission;
import com.trip.companion.domain.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JwtService {

    public static final String TOKEN_TYPE = "Bearer ";
    public static final String EMAIL_CLAIM = "email";

    private final JwtParser jwtParser;
    private final JwtConfiguration jwtConfiguration;

    @Autowired
    public JwtService(JwtParser jwtParser, JwtConfiguration jwtConfiguration) {
        this.jwtParser = jwtParser;
        this.jwtConfiguration = jwtConfiguration;
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(user.getId())
                .claim(EMAIL_CLAIM, user.getEmail())
                .setIssuedAt(now)
                .setExpiration(getJwtAccessTokenExpire(now))
                .signWith(SignatureAlgorithm.HS512, jwtConfiguration.getSecret())
                .compact();
    }

    private Date getJwtAccessTokenExpire(Date date) {
        return new Date(date.getTime() + jwtConfiguration.getAccessTokenExpirationInMs());
    }

    public Claims getJwtClaims(String jwt) {
        return jwtParser.setSigningKey(jwtConfiguration.getSecret()).parseClaimsJws(jwt).getBody();
    }

    public Date getJwtRefreshTokenExpire() {
        return new Date(System.currentTimeMillis() + jwtConfiguration.getRefreshTokenExpirationInMs());
    }

    public UserDetails getUserDetailsFromJwt(String jwt) {
        Claims claims = getJwtClaims(jwt);
        return org.springframework.security.core.userdetails.User.builder()
                .username(String.valueOf(claims.get(EMAIL_CLAIM)))
                .password("")
                .authorities(Collections.singletonList(Permission.USER))
                .build();
    }

}
