package Finance.Backend.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "utilisateurs")
public class Utilisateurs {

	@Id
	@Column(unique= true)
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
	
	private boolean valide = false;
	
	@NotBlank
	private String email;

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

	public boolean isValide() {
		return valide;
	}

	public void setValide(boolean valide) {
		this.valide = valide;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public Utilisateurs(String matricule, @NotBlank String nom, @NotBlank String prenom, @NotBlank String username,
			@NotBlank String division, @NotBlank String region, @NotBlank String password, boolean valide,
			@NotBlank String email) {
		super();
		this.matricule = matricule;
		this.nom = nom;
		this.prenom = prenom;
		this.username = username;
		this.division = division;
		this.region = region;
		this.password = password;
		this.valide = valide;
		this.email = email;
	}

	public Utilisateurs() {
		super();
	}
	
	
}
