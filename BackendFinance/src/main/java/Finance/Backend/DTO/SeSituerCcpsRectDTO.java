package Finance.Backend.DTO;

import java.math.BigDecimal;

public class SeSituerCcpsRectDTO {

    private RubriqueSoldeDTO rubrique;
    
    private BigDecimal montant;

	public RubriqueSoldeDTO getRubrique() {
		return rubrique;
	}

	public void setRubrique(RubriqueSoldeDTO rubrique) {
		this.rubrique = rubrique;
	}

	public BigDecimal getMontant() {
		return montant;
	}

	public void setMontant(BigDecimal montant) {
		this.montant = montant;
	}

	public SeSituerCcpsRectDTO(RubriqueSoldeDTO rubrique, BigDecimal montant) {
		super();
		this.rubrique = rubrique;
		this.montant = montant;
	}

	public SeSituerCcpsRectDTO() {
		super();
	}
}
