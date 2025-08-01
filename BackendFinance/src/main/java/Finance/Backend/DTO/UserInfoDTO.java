package Finance.Backend.DTO;

public class UserInfoDTO {
    private String nom;
    private String prenom;
    private String matricule;
    private String division;
    private String email;
    private String username;
    private String password;

    public UserInfoDTO() {
    }

    public UserInfoDTO(String nom, String prenom, String matricule, String division, String email, String username, String password) {
        this.nom = nom;
        this.prenom = prenom;
        this.matricule = matricule;
        this.division = division;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    // Getters et Setters
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
      return password;
    }

    public void setPassword(String password) {
      this.password = password;
    }
    
}