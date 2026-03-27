package io.github.flashlearn.app.auth.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Включаем поддержку @PreAuthorize и @PostAuthorize аннотаций
@Slf4j
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Кодирование паролей с использованием BCrypt алгоритма
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Менеджер аутентификации для обработки логина
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // Конфигурация цепочки фильтров безопасности
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Отключаем CSRF защиту, т.к. используем JWT токены (статeless архитектура)
                .csrf(AbstractHttpConfigurer::disable)

                // Настраиваем CORS для работы с фронтендом
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Настройка правил авторизации для различных эндпоинтов
                .authorizeHttpRequests(auth -> auth
                        // Разрешаем доступ без аутентификации к эндпоинтам регистрации, логина и лендинга
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/landing/**").permitAll()
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()
                        // Все остальные эндпоинты требуют аутентификации
                        .anyRequest().authenticated()
                )

                // Настраиваем обработку ошибок доступа: возвращаем 401 вместо редиректа на страницу логина
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )

                // Используем stateless сессии (без сохранения состояния на сервере)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Добавляем JWT фильтр перед стандартным фильтром аутентификации
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Конфигурация CORS для разрешения запросов с фронтенда
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Разрешаем запросы только с указанного источника (фронтенд)
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        // Разрешаем основные HTTP методы
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Разрешаем все заголовки (включая Authorization для JWT токенов)
        configuration.setAllowedHeaders(List.of("*"));
        // Разрешаем отправку credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Применяем конфигурацию CORS ко всем путям
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
