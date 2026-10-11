package com.example.scheduler.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.DefaultCorsProcessor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CorsConfigTest {

    private static final String FRONTEND_ORIGIN = "https://distributed-task-scheduler-orpin.vercel.app";

    @Test
    void allowsRegistrationPreflightFromVercelFrontend() throws Exception {
        CorsConfigurationSource source = new CorsConfig().corsConfigurationSource(
                new String[]{FRONTEND_ORIGIN, "http://localhost:3000", "http://localhost:3001"});
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/v1/auth/register");
        request.addHeader("Origin", FRONTEND_ORIGIN);
        request.addHeader("Access-Control-Request-Method", "POST");
        request.addHeader("Access-Control-Request-Headers", "content-type");
        MockHttpServletResponse response = new MockHttpServletResponse();

        CorsConfiguration configuration = source.getCorsConfiguration(request);
        boolean processed = new DefaultCorsProcessor().processRequest(configuration, request, response);

        assertTrue(processed);
        assertEquals(200, response.getStatus());
        assertEquals(FRONTEND_ORIGIN, response.getHeader("Access-Control-Allow-Origin"));
        assertTrue(response.getHeader("Access-Control-Allow-Methods").contains("POST"));

        MockHttpServletRequest localRequest = new MockHttpServletRequest("OPTIONS", "/api/v1/auth/register");
        localRequest.addHeader("Origin", "http://localhost:3001");
        localRequest.addHeader("Access-Control-Request-Method", "POST");
        localRequest.addHeader("Access-Control-Request-Headers", "content-type");
        MockHttpServletResponse localResponse = new MockHttpServletResponse();
        processed = new DefaultCorsProcessor().processRequest(
                source.getCorsConfiguration(localRequest), localRequest, localResponse);

        assertTrue(processed);
        assertEquals(200, localResponse.getStatus());
        assertEquals("http://localhost:3001", localResponse.getHeader("Access-Control-Allow-Origin"));
    }

    @Test
    void rejectsUnconfiguredOrigin() throws Exception {
        CorsConfigurationSource source = new CorsConfig().corsConfigurationSource(
                new String[]{FRONTEND_ORIGIN});
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/v1/auth/register");
        request.addHeader("Origin", "https://untrusted.example");
        request.addHeader("Access-Control-Request-Method", "POST");
        MockHttpServletResponse response = new MockHttpServletResponse();

        boolean processed = new DefaultCorsProcessor().processRequest(
                source.getCorsConfiguration(request), request, response);

        assertFalse(processed);
        assertEquals(403, response.getStatus());
    }
}
