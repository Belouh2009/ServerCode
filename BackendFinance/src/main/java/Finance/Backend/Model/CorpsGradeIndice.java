package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "corps_grade_indice", uniqueConstraints = @UniqueConstraint(columnNames = {"corps", "grade"}))
public class CorpsGradeIndice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String corps;

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

	public CorpsGradeIndice(Long id, String corps, String grade, Integer indice) {
		super();
		this.id = id;
		this.corps = corps;
		this.grade = grade;
		this.indice = indice;
	}

	public CorpsGradeIndice() {
		super();
	}
    
    
}
