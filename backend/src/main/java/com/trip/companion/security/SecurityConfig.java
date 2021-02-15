package com.trip.companion.security;

import com.trip.companion.error.GenericExceptionHandler;
import com.trip.companion.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserService userService;
    private final JwtService jwtService;
    private final GenericExceptionHandler exceptionHandler;

    @Autowired
    public SecurityConfig(UserService userService, GenericExceptionHandler exceptionHandler, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.exceptionHandler = exceptionHandler;
    }

    @Bean
    public SecurityService securityService() throws Exception {
        return new SecurityService(super.authenticationManagerBean(), userService, jwtService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .headers()
                .frameOptions()
                .disable()
                .and()
                .csrf()
                .disable()
                .cors()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint(exceptionHandler))
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/public/**")
                .permitAll()
                .antMatchers("/api/**")
                .authenticated()
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(securityService()),
                        UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    public UserDetailsService userDetailsService() {
        return userService;
    }

}