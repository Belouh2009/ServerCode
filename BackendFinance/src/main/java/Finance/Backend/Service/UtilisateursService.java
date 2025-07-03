package Finance.Backend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Finance.Backend.DTO.LoginResponseDTO;
import Finance.Backend.DTO.RegistreDTO;
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
	        if(userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
	            return "Nom Utilisateur déjà utilisé";
	        }
	        
	        emailService.sendRegistrationNotification(
	        	    registerDTO.getNom(),
	        	    registerDTO.getPrenom(),
	        	    registerDTO.getUsername(),
	        	    registerDTO.getEmail(),
	        	    registerDTO.getDivision()
	        	);


	        Utilisateurs user = new Utilisateurs();
	        user.setMatricule(registerDTO.getMatricule());
	        user.setNom(registerDTO.getNom());
	        user.setPrenom(registerDTO.getPrenom());
	        user.setUsername(registerDTO.getUsername());
	        user.setDivision(registerDTO.getDivision());
	        user.setRegion(registerDTO.getRegion());
	        user.setEmail(registerDTO.getEmail());
	        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
	        user.setValide(false); // Initialisation en tant qu'utilisateur non validé
	        userRepository.save(user);

	        return "Compte créé avec succès. En attente de validation!";
	    }

	    public String valideUser(String matricule) {
	        Optional<Utilisateurs> userOptional = userRepository.findByMatricule(matricule);  // Recherche par matricule
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
	            return userRepository.findByValide(true); // Recherche des utilisateurs validés
	        } else {
	            return userRepository.findByValide(false); // Recherche des utilisateurs non validés
	        }
	    }
	    
	    
	 // Méthode pour supprimer un utilisateur par matricule
	    public void supprimerUtilisateur(String matricule) {
	        // Vérifie si l'utilisateur existe avant de le supprimer
	        Utilisateurs user = userRepository.findByMatricule(matricule).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
	        
	        userRepository.delete(user); // Supprime l'utilisateur
	    }
	    
	    
	    
	    // Méthode pour enregistrer ou mettre à jour un utilisateur avec password encodé
	    public Utilisateurs saveOrUpdateUtilisateur(Utilisateurs utilisateur) {
	        // Encodage du mot de passe avant d'enregistrer
	        String encodedPassword = passwordEncoder.encode(utilisateur.getPassword());
	        utilisateur.setPassword(encodedPassword);
	        utilisateur.setValide(false); // Remettre valide à false

	        // Enregistrement ou mise à jour dans la base
	        return userRepository.save(utilisateur);
	    }

	    // Méthode pour récupérer un utilisateur par son matricule
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
	                    user.getPrenom()
	                );
	            }
	        }
	        return null; // ou tu peux lever une exception custom si besoin
	    }

}
