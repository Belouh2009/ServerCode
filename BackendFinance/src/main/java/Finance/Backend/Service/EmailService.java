package Finance.Backend.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String adminEmail = "acandimario11@gmail.com";
    private final String appLink = "http://localhost:5173/login?redirect=/utilisateurs";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationNotification(String nom, String prenom, String username, String email, String division) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(adminEmail); // Adresse de l'admin
        message.setSubject("Nouvelle inscription utilisateur");

        String content = String.format("""
Bonjour Administrateur,

Un nouvel utilisateur a effectué une demande d'inscription.

➡️ Nom           : %s
➡️ Prénom        : %s
➡️ Nom utilisateur : %s
➡️ Email         : %s
➡️ Division      : %s

Veuillez cliquer sur le lien ci-dessous pour vous connecter et accéder à la page de validation :

🔗 %s

Merci de traiter cette demande dès que possible.

""", nom, prenom, username, email, division, appLink);

        message.setText(content);
        message.setFrom("andrynambinintso277@gmail.com"); // doit être égal à spring.mail.username
        mailSender.send(message);
    }
}
