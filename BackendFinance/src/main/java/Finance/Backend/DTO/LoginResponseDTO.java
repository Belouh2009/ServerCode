package Finance.Backend.DTO;

public class LoginResponseDTO {

    private String username;
    
    private String division;
    
    private String region;
    
    private String nom;
    
    private String prenom;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDivision() {
		return division;
	}

	public void setDivision(String division) {
		this.division = division;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

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

	public LoginResponseDTO(String username, String division, String region, String nom, String prenom) {
		super();
		this.username = username;
		this.division = division;
		this.region = region;
		this.nom = nom;
		this.prenom = prenom;
	}

	public LoginResponseDTO() {
		super();
	}
	
}
