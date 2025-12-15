package com.bioagricola.apirest.aprovechamiento.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception{
		http.cors().and().csrf().disable().authorizeRequests()
		.antMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
				"/login", //for local env
                "/swagger-ui.html",
                "/webjars/**",
                "/version").permitAll()
		.anyRequest().authenticated()
		.and()
		.addFilterBefore( new JwtFilter(), 
				UsernamePasswordAuthenticationFilter.class);
	}
}