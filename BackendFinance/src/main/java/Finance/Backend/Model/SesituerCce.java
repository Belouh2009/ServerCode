package Finance.Backend.Model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "sesituercce")
public class SesituerCce {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSesituer;

	@ManyToOne
	@JoinColumn(name = "id_agent", nullable = false)
	@JsonIgnoreProperties("sesituer")
	private AgentCce agentcce;
	
    @ManyToOne
    @JoinColumn(name = "id_rubrique", nullable = false)
    private RubriquePension rubrique;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

	public Integer getIdSesituer() {
		return idSesituer;
	}

	public void setIdSesituer(Integer idSesituer) {
		this.idSesituer = idSesituer;
	}

	public AgentCce getAgent() {
		return agentcce;
	}

	public void setAgent(AgentCce agentcce) {
		this.agentcce = agentcce;
	}

	public RubriquePension getRubrique() {
		return rubrique;
	}

	public void setRubrique(RubriquePension rubrique) {
		this.rubrique = rubrique;
	}

	public BigDecimal getMontant() {
		return montant;
	}

	public void setMontant(BigDecimal montant) {
		this.montant = montant;
	}

	public SesituerCce(Integer idSesituer, AgentCce agentcce, RubriquePension rubrique, BigDecimal montant) {
		super();
		this.idSesituer = idSesituer;
		this.agentcce = agentcce;
		this.rubrique = rubrique;
		this.montant = montant;
	}

	public SesituerCce() {
		super();
	}
    
    
}
