package Finance.Backend.DTO;

import jakarta.validation.constraints.NotBlank;

public class RegistreDTO {

	@NotBlank
	private String matricule;
	
	@NotBlank
	private String nom;
	
	@NotBlank
	private String prenom;
	
	
	@NotBlank
	private String username;
	
	@NotBlank
	private String division;
	
	@NotBlank
	private String region;
	
	@NotBlank
	private String password;
	
	@NotBlank
	private String email;
	
	
	public RegistreDTO() {
		super();
	}


	public String getMatricule() {
		return matricule;
	}


	public void setMatricule(String matricule) {
		this.matricule = matricule;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}
	
	
}
