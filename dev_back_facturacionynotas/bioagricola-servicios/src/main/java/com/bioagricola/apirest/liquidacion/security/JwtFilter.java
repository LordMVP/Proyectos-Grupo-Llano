package com.bioagricola.apirest.liquidacion.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Objects;

public class JwtFilter extends GenericFilterBean {

    private JwtUtil jwtUtil;
    private Authentication authentication;

    public JwtFilter() {
        jwtUtil = new JwtUtil();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest servletRequest = (HttpServletRequest) request;
        HttpServletResponse servletResponse = (HttpServletResponse) response;
        String URL = servletRequest.getRequestURI();

        if (URL.endsWith("/test") || URL.endsWith("/version") || URL.endsWith("/login") /*|| URL.endsWith("/Preliquidacion")|| URL.endsWith("/Reliquidacion")*/) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            HttpServletResponse myResponse = (HttpServletResponse) response;

            // Prueba de obtener headers
            Enumeration<String> headerNames = servletRequest.getHeaderNames();

            if (headerNames != null) {
                while (headerNames.hasMoreElements()) {
                    System.out.println("Header: " + servletRequest.getHeader(headerNames.nextElement()));
                }
            }

            // FIN Prueba obtener headers
            authentication = jwtUtil.renovarSesion((HttpServletRequest) request);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String newToken = jwtUtil.renovarToken((HttpServletRequest) request);

            if (Objects.nonNull(newToken)) {
                // MyResponseRequestWrapper responseWrapper = new
                // MyResponseRequestWrapper(myResponse);
                // responseWrapper.addHeader("Authorization", newToken);
                myResponse.setHeader("Authorization", newToken);
            }
            filterChain.doFilter(request, myResponse);
        }

    }
}
