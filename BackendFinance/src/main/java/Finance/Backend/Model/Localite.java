package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "localite")
public class Localite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public Localite(Long id, String nom) {
		super();
		this.id = id;
		this.nom = nom;
	}

	public Localite() {
		super();
	}
    
    
}
