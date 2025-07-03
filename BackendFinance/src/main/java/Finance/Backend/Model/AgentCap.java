package Finance.Backend.Model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "agent")
public class AgentCap {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAgent;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    private String numPension;
    private String civilite;
    private String caisse;
    private String assignation;
    
    @Column(columnDefinition = "TEXT")
    private String additionalInfo;

    @OneToOne(cascade = CascadeType.ALL) // Prise en charge de l'insertion ou mise à jour du certificat
    @JoinColumn(name = "id_certificat", referencedColumnName = "idCertificat", unique = true, nullable = true)
    private CertificatCap certificat;
    
    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<SesituerCap> sesituer = new ArrayList<>();


	public Long getIdAgent() {
		return idAgent;
	}

	public void setIdAgent(Long idAgent) {
		this.idAgent = idAgent;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getCivilite() {
		return civilite;
	}

	public void setCivilite(String civilite) {
		this.civilite = civilite;
	}

	public String getCaisse() {
		return caisse;
	}

	public void setCaisse(String caisse) {
		this.caisse = caisse;
	}

	public String getAssignation() {
		return assignation;
	}

	public void setAssignation(String assignation) {
		this.assignation = assignation;
	}

	public String getAdditionalInfo() {
		return additionalInfo;
	}

	public void setAdditionalInfo(String additionalInfo) {
		this.additionalInfo = additionalInfo;
	}

	public CertificatCap getCertificat() {
		return certificat;
	}

	public void setCertificat(CertificatCap certificat) {
		this.certificat = certificat;
	}

	public String getNumPension() {
		return numPension;
	}

	public void setNumPension(String numPension) {
		this.numPension = numPension;
	}

	

	public AgentCap(Long idAgent, String nom, String prenom, String numPension, String civilite, String caisse,
			String assignation, String additionalInfo, CertificatCap certificat, List<SesituerCap> sesituer) {
		super();
		this.idAgent = idAgent;
		this.nom = nom;
		this.prenom = prenom;
		this.numPension = numPension;
		this.civilite = civilite;
		this.caisse = caisse;
		this.assignation = assignation;
		this.additionalInfo = additionalInfo;
		this.certificat = certificat;
		this.sesituer = sesituer;
	}

	public AgentCap() {
		super();
	}

	public List<SesituerCap> getSesituer() {
		return sesituer;
	}

    public void setSesituer(List<SesituerCap> sesituer) {
        this.sesituer.clear();  // Évite la duplication
        if (sesituer != null) {
            this.sesituer.addAll(sesituer);
        }
    }
}
