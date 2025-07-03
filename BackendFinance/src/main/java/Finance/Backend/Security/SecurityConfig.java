package Finance.Backend.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Désactiver la protection CSRF
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())  // Permettre toutes les requêtes sans authentification
            .formLogin(form -> form.disable())  // Désactiver le formulaire de connexion
            .httpBasic(basic -> basic.disable()); // Désactiver l'authentification basique

        return http.build();
    }

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
