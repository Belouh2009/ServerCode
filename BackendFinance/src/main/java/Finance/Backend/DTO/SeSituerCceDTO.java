package Finance.Backend.DTO;

import java.math.BigDecimal;

public class SeSituerCceDTO {

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
	public SeSituerCceDTO(RubriqueDTO rubrique, BigDecimal montant) {
		super();
		this.rubrique = rubrique;
		this.montant = montant;
	}
	public SeSituerCceDTO() {
		super();
	}
    
    
}
