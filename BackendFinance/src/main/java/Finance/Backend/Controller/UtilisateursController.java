package Finance.Backend.Controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import Finance.Backend.DTO.LoginDTO;
import Finance.Backend.DTO.LoginResponseDTO;
import Finance.Backend.DTO.RegistreDTO;
import Finance.Backend.DTO.UserInfoDTO;
import Finance.Backend.Model.Utilisateurs;
import Finance.Backend.Repository.UtilisateurRepository;
import Finance.Backend.Service.UtilisateursService;
import jakarta.validation.Valid;

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

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerUser(
            @RequestPart("data") @Valid RegistreDTO registerDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            String imageName = "user.jpg"; // image par défaut

            if (imageFile != null && !imageFile.isEmpty()) {
                System.out.println("Image reçue : " + imageFile.getOriginalFilename());

                String uploadsDir = System.getProperty("user.dir") + "/uploads/";
                Path uploadPath = Paths.get(uploadsDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFilename = Paths.get(imageFile.getOriginalFilename()).getFileName().toString();
                String newFilename = System.currentTimeMillis() + "_" + originalFilename;

                Path filePath = uploadPath.resolve(newFilename);
                Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                imageName = newFilename;
            } else if (registerDTO.getImage() != null && !registerDTO.getImage().isEmpty()) {
                imageName = registerDTO.getImage();
                System.out.println("Pas d'image uploadée, utilisation de l'image par défaut : " + imageName);
            } else {
                System.out.println("Aucune image reçue, on utilisera l'image par défaut");
            }

            registerDTO.setImage(imageName);
            String message = userService.registerUser(registerDTO);

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'enregistrement de l'utilisateur");
        }
    }

    @PostMapping("/valide/{matricule}")
    public ResponseEntity<String> validateUser(@PathVariable String matricule) {
        String result = userService.valideUser(matricule);
        if ("Utilisateur non trouvé".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/blocke/{matricule}")
    public ResponseEntity<String> blockedUser(@PathVariable String matricule) {
        String result = userService.blockedUser(matricule);
        if ("Utilisateur non trouvé".equals(result)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{matricule}")
    public ResponseEntity<String> supprimerUtilisateur(@PathVariable String matricule) {
        try {
            userService.supprimerUtilisateur(matricule);
            return ResponseEntity.ok("Utilisateur supprimé avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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
    public ResponseEntity<List<Utilisateurs>> getUsers(@RequestParam String status) {
        List<Utilisateurs> users = userService.getUsersByStatus(status);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/non-valide/count")
    public ResponseEntity<Long> getNonValideCount() {
        long count = userRepository.countByValide(false);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/update")
    public ResponseEntity<Utilisateurs> updateUtilisateur(@RequestBody Utilisateurs utilisateur) {
        Utilisateurs updatedUtilisateur = userService.saveOrUpdateUtilisateur(utilisateur);
        return ResponseEntity.ok(updatedUtilisateur);
    }

    @GetMapping("/{matricule}")
    public ResponseEntity<Utilisateurs> getUtilisateur(@PathVariable String matricule) {
        Utilisateurs utilisateur = userService.getUtilisateurByMatricule(matricule);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        try {
            UserInfoDTO userInfo = userService.getUserInfoByUsername(username);
            return ResponseEntity.ok(userInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfile(
            @RequestPart("nom") String nom,
            @RequestPart("prenom") String prenom,
            @RequestPart("email") String email,
            @RequestPart("division") String division,
            @RequestPart("matricule") String matricule,
            @RequestPart("username") String username,
            @RequestPart(value = "password", required = false) String password,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            UserInfoDTO userInfoDTO = new UserInfoDTO(nom, prenom, matricule, division, email, username, password, null);

            if (imageFile != null && !imageFile.isEmpty()) {
                String imageName = saveImage(imageFile);
                userInfoDTO.setImage(imageName);
            }

            Utilisateurs updatedUser = userService.updateUserInfo(userInfoDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String saveImage(MultipartFile imageFile) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        File uploadPath = new File(uploadDir);

        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
        File dest = new File(uploadDir + fileName);
        imageFile.transferTo(dest);

        return fileName;
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get(System.getProperty("user.dir") + "/uploads/").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}