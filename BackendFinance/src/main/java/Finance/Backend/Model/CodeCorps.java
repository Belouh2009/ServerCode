package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "corps")
public class CodeCorps {

	@Id
	private String idCorps;
	private String libelleCorps;
	private String categorie;
	public String getIdCorps() {
		return idCorps;
	}
	public void setIdCorps(String idCorps) {
		this.idCorps = idCorps;
	}
	public String getLibelleCorps() {
		return libelleCorps;
	}
	public void setLibelleCorps(String libelleCorps) {
		this.libelleCorps = libelleCorps;
	}
	public String getCategorie() {
		return categorie;
	}
	public void setCategorie(String categorie) {
		this.categorie = categorie;
	}
	public CodeCorps(String idCorps, String libelleCorps, String categorie) {
		super();
		this.idCorps = idCorps;
		this.libelleCorps = libelleCorps;
		this.categorie = categorie;
	}
	public CodeCorps() {
		super();
	}
	
	
}
