package com.trip.companion.domain.user;

import org.springframework.security.core.GrantedAuthority;

public enum Permission implements GrantedAuthority {
    USER;

    @Override
    public String getAuthority() {
        return this.toString();
    }
}
