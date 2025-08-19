package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "corps", uniqueConstraints = @UniqueConstraint(columnNames = { "corps", "grade" }))
public class CodeCorps {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String corps;

	private String libelleCorps;

	private String categorie;

	@Column(nullable = false, length = 10)
	private String grade;

	@Column(nullable = true)
	private Integer indice;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCorps() {
		return corps;
	}

	public void setCorps(String corps) {
		this.corps = corps;
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

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public Integer getIndice() {
		return indice;
	}

	public void setIndice(Integer indice) {
		this.indice = indice;
	}

	public CodeCorps(Long id, String corps, String libelleCorps, String categorie, String grade, Integer indice) {
		this.id = id;
		this.corps = corps;
		this.libelleCorps = libelleCorps;
		this.categorie = categorie;
		this.grade = grade;
		this.indice = indice;
	}

	public CodeCorps() {
	}

	

}
