package io.github.flashlearn.app.auth.security;

import io.github.flashlearn.app.user.entity.Role;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain) throws ServletException, IOException {

        try {
            String bearer = request.getHeader("Authorization");
            String token = null;
            if (bearer != null && bearer.startsWith("Bearer ")) {
                token = bearer.substring(7);
            }
            if (token != null) {
                Claims claims = jwtTokenProvider.parse(token);
                Long userId = claims.get("id", Long.class);
                String username = claims.getSubject();
                String roleStr = claims.get("role", String.class);
                Role role = Role.valueOf(roleStr);
                // Защита: если уже есть аутентификация в контексте — не перезаписываем её
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    CustomUserDetails userDetails = new CustomUserDetails(
                            userId,
                            username,
                            null,
                            role
                    );

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

}
