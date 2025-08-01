package Finance.Backend.DTO;

import java.math.BigDecimal;

public class SeSituerCapDTO {

    private RubriqueDTO rubrique;
    private BigDecimal montant;
	public RubriqueDTO getRubrique() {
		return rubrique;
	}
	public void setRubrique(RubriqueDTO rubrique) {
		this.rubrique = rubrique;
	}
	public BigDecimal getMontant() {
		return montant;
	}
	public void setMontant(BigDecimal montant) {
		this.montant = montant;
	}
	public SeSituerCapDTO(RubriqueDTO rubrique, BigDecimal montant) {
		super();
		this.rubrique = rubrique;
		this.montant = montant;
	}
	public SeSituerCapDTO() {
		super();
	}
    
    
}
