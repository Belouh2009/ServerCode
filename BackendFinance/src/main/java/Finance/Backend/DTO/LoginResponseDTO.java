package Finance.Backend.DTO;

public class LoginResponseDTO {
    private String username;
    private String division;
    private String region;
    private String nom;
    private String prenom;
    private String image;  // <-- ajout ici

    public LoginResponseDTO(String username, String division, String region, String nom, String prenom, String image) {
        this.username = username;
        this.division = division;
        this.region = region;
        this.nom = nom;
        this.prenom = prenom;
        this.image = image;
    }

    // Getters et setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
