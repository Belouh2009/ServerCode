package Finance.Backend.Model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "sesituerccpsrect")
public class SesituerCcpsRect {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idsesituer")
    private Integer idSesituer;

	@ManyToOne
	@JoinColumn(name = "id_agent", nullable = false)
	@JsonIgnoreProperties("sesituer")
	private AgentCcpsRect agentccps;
	
    @ManyToOne
    @JoinColumn(name = "id_rubrique", nullable = false)
    private RubriqueSolde rubrique;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

	public Integer getIdSesituer() {
		return idSesituer;
	}

	public void setIdSesituer(Integer idSesituer) {
		this.idSesituer = idSesituer;
	}

	public AgentCcpsRect getAgentccps() {
		return agentccps;
	}

	public void setAgentccps(AgentCcpsRect agentccps) {
		this.agentccps = agentccps;
	}

	public RubriqueSolde getRubrique() {
		return rubrique;
	}

	public void setRubrique(RubriqueSolde rubrique) {
		this.rubrique = rubrique;
	}

	public BigDecimal getMontant() {
		return montant;
	}

	public void setMontant(BigDecimal montant) {
		this.montant = montant;
	}

	public SesituerCcpsRect(Integer idSesituer, AgentCcpsRect agentccps, RubriqueSolde rubrique, BigDecimal montant) {
		super();
		this.idSesituer = idSesituer;
		this.agentccps = agentccps;
		this.rubrique = rubrique;
		this.montant = montant;
	}

	public SesituerCcpsRect() {
		super();
	}
    
}
