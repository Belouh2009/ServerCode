package Finance.Backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.DTO.LoginDTO;
import Finance.Backend.DTO.LoginResponseDTO;
import Finance.Backend.DTO.RegistreDTO;
import Finance.Backend.Model.Utilisateurs;
import Finance.Backend.Repository.UtilisateurRepository;
import Finance.Backend.Service.UtilisateursService;

@RestController
@RequestMapping("/utilisateur")
@CrossOrigin("*")
public class UtilisateursController {

	private final UtilisateursService userService;
    private final UtilisateurRepository userRepository;

    @Autowired
    public UtilisateursController(UtilisateursService userService, UtilisateurRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegistreDTO registerDTO) {
        return userService.registerUser(registerDTO);
    }

    @PostMapping("/valide/{matricule}")
    public ResponseEntity<String> validateUser(@PathVariable String matricule) {
        // Utilisation du service pour valider l'utilisateur
        String result = userService.valideUser(matricule);
        if (result.equals("Utilisateur non trouvé")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/blocke/{matricule}")
    public ResponseEntity<String> blockedUser(@PathVariable String matricule) {
        String result = userService.blockedUser(matricule);
        if (result.equals("Utilisateur non trouvé")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
        return ResponseEntity.ok(result);
    }
    
 // Endpoint pour supprimer un utilisateur
    @DeleteMapping("/delete/{matricule}")
    public ResponseEntity<String> supprimerUtilisateur(@PathVariable String matricule) {
        try {
            userService.supprimerUtilisateur(matricule);
            return ResponseEntity.ok("Utilisateur supprimé avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }
    }
    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        LoginResponseDTO user = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connexion réussie");
            response.put("user", user);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Nom d'utilisateur ou mot de passe incorrect, ou compte non validé");
        }
    }



    @GetMapping
    public List<Utilisateurs> getUsers(@RequestParam String status) {
        return userService.getUsersByStatus(status);
    }

    @GetMapping("/non-valide/count")
    public long getNonValideCount() {
        return userRepository.countByValide(false);  // Supposant que la méthode countByValide existe dans le repository
    }
    
    
    
    // Endpoint pour enregistrer ou mettre à jour les informations d'un utilisateur
    @PutMapping("/update")
    public ResponseEntity<Utilisateurs> updateUtilisateur(@RequestBody Utilisateurs utilisateur) {
        Utilisateurs updatedUtilisateur = userService.saveOrUpdateUtilisateur(utilisateur);
        return ResponseEntity.ok(updatedUtilisateur);
    }


    // Endpoint pour récupérer les informations d'un utilisateur
    @GetMapping("/{matricule}")
    public ResponseEntity<Utilisateurs> getUtilisateur(@PathVariable String matricule) {
        Utilisateurs utilisateur = userService.getUtilisateurByMatricule(matricule);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
