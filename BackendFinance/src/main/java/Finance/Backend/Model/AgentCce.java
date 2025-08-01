package Finance.Backend.Model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
@Table(name = "agentcce")
public class AgentCce {

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
    
    @Column(name = "additional_info")
    private String additionalInfo;
    
    @Column(nullable = false)
    private LocalDate dateDece;
    
    @Column(nullable = false)
    private LocalDate dateAnnulation;

    @OneToOne(cascade = CascadeType.ALL) // Prise en charge de l'insertion ou mise à jour du certificat
    @JoinColumn(name = "id_certificat", referencedColumnName = "idCertificat", unique = true, nullable = true)
    private CertificatCce certificat;
    
    @OneToMany(mappedBy = "agentcce", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<SesituerCce> sesituer = new ArrayList<>();

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

	public String getNumPension() {
		return numPension;
	}

	public void setNumPension(String numPension) {
		this.numPension = numPension;
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

	public LocalDate getDateDece() {
		return dateDece;
	}

	public void setDateDece(LocalDate dateDece) {
		this.dateDece = dateDece;
	}

	public LocalDate getDateAnnulation() {
		return dateAnnulation;
	}

	public void setDateAnnulation(LocalDate dateAnnulation) {
		this.dateAnnulation = dateAnnulation;
	}

	public CertificatCce getCertificat() {
		return certificat;
	}

	public void setCertificat(CertificatCce certificat) {
		this.certificat = certificat;
	}

	public List<SesituerCce> getSesituer() {
		return sesituer;
	}

	public void setSesituer(List<SesituerCce> sesituer) {
		this.sesituer.clear();  // Évite la duplication
        if (sesituer != null) {
            this.sesituer.addAll(sesituer);
        }
	}

	public AgentCce(Long idAgent, String nom, String prenom, String numPension, String civilite, String caisse,
			String assignation, String additionalInfo, LocalDate dateDece, LocalDate dateAnnulation,
			CertificatCce certificat, List<SesituerCce> sesituer) {
		super();
		this.idAgent = idAgent;
		this.nom = nom;
		this.prenom = prenom;
		this.numPension = numPension;
		this.civilite = civilite;
		this.caisse = caisse;
		this.assignation = assignation;
		this.additionalInfo = additionalInfo;
		this.dateDece = dateDece;
		this.dateAnnulation = dateAnnulation;
		this.certificat = certificat;
		this.sesituer = sesituer;
	}

	public AgentCce() {
		super();
	}
    
    
    
}
