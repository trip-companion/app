package com.trip.companion.domain.user;

import com.trip.companion.domain.Gender;
import com.trip.companion.domain.base.BaseEntity;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import javax.management.relation.Role;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Document
@Data
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity implements UserDetails {

    private String email;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private Gender gender;
    private Status status;
    private String avatarId;
    private String about;
    private List<LanguageLevelItem> languages = new ArrayList<>();
    private List<String> knownSkills = new ArrayList<>();
    private List<String> interestedInSkills = new ArrayList<>();
    private List<String> canTeachSkills = new ArrayList<>();
    private List<String> interests = new ArrayList<>();
    private List<String> features = new ArrayList<>();

    private String password;
    private String jwtRefreshToken;
    private Date jwtRefreshTokenExpireDate;
    private Role role;
    private List<Permission> permissions;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return permissions;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Data
    public static class LanguageLevelItem implements Serializable {
        private String isoCode;
        private LanguageLevel level;
    }
}
