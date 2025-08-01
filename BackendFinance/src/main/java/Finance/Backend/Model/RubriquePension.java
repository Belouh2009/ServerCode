package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "rubrique")
public class RubriquePension {

	 @Id
	 @Column(name = "id_rubrique", length = 15, nullable = false)
	    private String idRubrique;

	 @Column(nullable = false, length = 255)
	 private String libelle;

	public String getIdRubrique() {
		return idRubrique;
	}

	public void setIdRubrique(String idRubrique) {
		this.idRubrique = idRubrique;
	}

	public String getLibelle() {
		return libelle;
	}

	public void setLibelle(String libelle) {
		this.libelle = libelle;
	}

	public RubriquePension(String idRubrique, String libelle) {
		super();
		this.idRubrique = idRubrique;
		this.libelle = libelle;
	}

	public RubriquePension() {
		super();
	}
	 
	 
}
