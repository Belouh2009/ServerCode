package Finance.Backend.DTO;

public class RubriqueSoldeDTO {

	private String id_rubrique;
	
	private String libelle;

	public String getId_rubrique() {
		return id_rubrique;
	}

	public void setId_rubrique(String id_rubrique) {
		this.id_rubrique = id_rubrique;
	}

	public String getLibelle() {
		return libelle;
	}

	public void setLibelle(String libelle) {
		this.libelle = libelle;
	}

	public RubriqueSoldeDTO(String id_rubrique, String libelle) {
		super();
		this.id_rubrique = id_rubrique;
		this.libelle = libelle;
	}

	public RubriqueSoldeDTO() {
		super();
	}
	
	
}
