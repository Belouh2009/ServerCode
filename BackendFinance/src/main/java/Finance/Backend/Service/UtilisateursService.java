package Finance.Backend.Service;

import java.io.File;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Finance.Backend.DTO.LoginResponseDTO;
import Finance.Backend.DTO.RegistreDTO;
import Finance.Backend.DTO.UserInfoDTO;
import Finance.Backend.Model.Utilisateurs;
import Finance.Backend.Repository.UtilisateurRepository;

@Service
public class UtilisateursService {

	private final UtilisateurRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final EmailService emailService;

	public UtilisateursService(UtilisateurRepository userRepository,
			PasswordEncoder passwordEncoder,
			EmailService emailService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.emailService = emailService;
	}

public String registerUser(RegistreDTO registerDTO) {
    // Vérification username existant
    if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
        throw new RuntimeException("Nom d'utilisateur déjà utilisé");
    }

    // Vérification matricule existant
    if (userRepository.findByMatricule(registerDTO.getMatricule()).isPresent()) {
        throw new RuntimeException("Matricule déjà utilisé");
    }

    // Envoi notification
    emailService.sendRegistrationNotification(
            registerDTO.getNom(),
            registerDTO.getPrenom(),
            registerDTO.getUsername(),
            registerDTO.getEmail(),
            registerDTO.getDivision());

    // Création utilisateur
    Utilisateurs user = new Utilisateurs();
    user.setMatricule(registerDTO.getMatricule());
    user.setNom(registerDTO.getNom());
    user.setPrenom(registerDTO.getPrenom());
    user.setUsername(registerDTO.getUsername());
    user.setDivision(registerDTO.getDivision());
    user.setRegion(registerDTO.getRegion());
    user.setEmail(registerDTO.getEmail());
    user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
    user.setValide(false);

    String imageName = registerDTO.getImage();
    if (imageName == null || imageName.trim().isEmpty()) {
        imageName = "user.jpg"; // image par défaut
    }
    user.setImage(imageName);

    userRepository.save(user);
    return "Compte créé avec succès. En attente de validation!";
}

	public String valideUser(String matricule) {
		Optional<Utilisateurs> userOptional = userRepository.findByMatricule(matricule);
		if (userOptional.isPresent()) {
			Utilisateurs user = userOptional.get();
			if (user.isValide()) {
				return "L'utilisateur est déjà validé";
			}
			user.setValide(true);
			userRepository.save(user);
			return "Compte validé avec succès";
		}
		return "Utilisateur non trouvé";
	}

	public String blockedUser(String matricule) {
		Optional<Utilisateurs> userOptional = userRepository.findByMatricule(matricule);
		if (userOptional.isPresent()) {
			Utilisateurs user = userOptional.get();
			if (!user.isValide()) {
				return "L'utilisateur est déjà bloqué";
			}
			user.setValide(false);
			userRepository.save(user);
			return "Compte bloqué avec succès";
		}
		return "Utilisateur non trouvé";
	}

	public boolean authenticate(String username, String password) {
		Optional<Utilisateurs> userOptional = userRepository.findByUsername(username);
		if (userOptional.isPresent()) {
			Utilisateurs user = userOptional.get();
			return user.isValide() && passwordEncoder.matches(password, user.getPassword());
		}
		return false;
	}

	public List<Utilisateurs> getUsersByStatus(String status) {
		if ("valid".equalsIgnoreCase(status)) {
			return userRepository.findByValide(true);
		} else {
			return userRepository.findByValide(false);
		}
	}

	public void supprimerUtilisateur(String matricule) {
		Utilisateurs user = userRepository.findByMatricule(matricule)
				.orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
		userRepository.delete(user);
	}

	public Utilisateurs saveOrUpdateUtilisateur(Utilisateurs utilisateur) {
		// Encodage du mot de passe avant d'enregistrer
		String encodedPassword = passwordEncoder.encode(utilisateur.getPassword());
		utilisateur.setPassword(encodedPassword);
		utilisateur.setValide(false);

		// Si l'image est null, on peut assigner une image par défaut
		if (utilisateur.getImage() == null || utilisateur.getImage().isEmpty()) {
			utilisateur.setImage("default.jpg");
		}

		return userRepository.save(utilisateur);
	}

	public Utilisateurs getUtilisateurByMatricule(String matricule) {
		return userRepository.findById(matricule).orElse(null);
	}

	public LoginResponseDTO login(String username, String password) {
		Optional<Utilisateurs> userOptional = userRepository.findByUsername(username);
		if (userOptional.isPresent()) {
			Utilisateurs user = userOptional.get();
			if (user.isValide() && passwordEncoder.matches(password, user.getPassword())) {
				return new LoginResponseDTO(
						user.getUsername(),
						user.getDivision(),
						user.getRegion(),
						user.getNom(),
						user.getPrenom(),
						user.getImage() // si tu souhaites envoyer l'image aussi
				);
			}
		}
		return null;
	}

	public Utilisateurs getUtilisateurByUsername(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
	}

	public UserInfoDTO getUserInfoByUsername(String username) {
		Utilisateurs user = getUtilisateurByUsername(username);

		return new UserInfoDTO(
				user.getNom(),
				user.getPrenom(),
				user.getMatricule(),
				user.getDivision(),
				user.getEmail(),
				user.getUsername(),
				null, // Ne jamais exposer le mot de passe
				user.getImage());
	}

	public Utilisateurs updateUserInfo(UserInfoDTO userInfoDTO) {
		Utilisateurs utilisateur = userRepository.findByUsername(userInfoDTO.getUsername())
				.orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

		utilisateur.setNom(userInfoDTO.getNom());
		utilisateur.setPrenom(userInfoDTO.getPrenom());
		utilisateur.setEmail(userInfoDTO.getEmail());
		utilisateur.setDivision(userInfoDTO.getDivision());
		utilisateur.setMatricule(userInfoDTO.getMatricule());

		if (userInfoDTO.getPassword() != null && !userInfoDTO.getPassword().isEmpty()) {
			utilisateur.setPassword(passwordEncoder.encode(userInfoDTO.getPassword()));
		}

		// Mettre à jour l'image si elle est présente
		if (userInfoDTO.getImage() != null && !userInfoDTO.getImage().isEmpty()) {
			// Supprime l'ancienne image si elle existe
			if (utilisateur.getImage() != null && !utilisateur.getImage().equals("user.jpg")) {
				File oldImage = new File("uploads/" + utilisateur.getImage());
				if (oldImage.exists()) {
					oldImage.delete();
				}
			}
			utilisateur.setImage(userInfoDTO.getImage());
		}

		return userRepository.save(utilisateur);
	}
}
