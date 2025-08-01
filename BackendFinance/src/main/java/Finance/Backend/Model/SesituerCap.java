package Finance.Backend.Model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "sesituer")
public class SesituerCap {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSesituer;

	@ManyToOne
	@JoinColumn(name = "id_agent", nullable = false)
	@JsonIgnoreProperties("sesituer")
	private AgentCap agent;



    @ManyToOne
    @JoinColumn(name = "id_rubrique", nullable = false)
    private RubriquePension rubrique;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

	public Integer getIdSeSituer() {
		return idSesituer;
	}

	public void setIdSeSituer(Integer idSeSituer) {
		this.idSesituer = idSeSituer;
	}

	public AgentCap getAgent() {
		return agent;
	}

	public void setAgent(AgentCap agent) {
		this.agent = agent;
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

	public SesituerCap(Integer idSeSituer, AgentCap agent, RubriquePension rubrique, BigDecimal montant) {
		super();
		this.idSesituer = idSeSituer;
		this.agent = agent;
		this.rubrique = rubrique;
		this.montant = montant;
	}

	public SesituerCap() {
		super();
	}
    
    
}
