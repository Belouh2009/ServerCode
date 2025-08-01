package Finance.Backend.DTO;

import java.time.LocalDate;
import java.util.List;

public class AgentCceDTO {

    private Long idAgent; // Ajout du champ id_agent
    private String nom;
    private String prenom;
    private String civilite;
    private String num_pension;
    private String caisse;
    private String assignation;
    private String additionalInfo;
    private LocalDate dateDece;
    private LocalDate dateAnnulation;
    private CertificatCceDTO certificat;
    private List<SeSituerCceDTO> sesituer;
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
	public String getNum_pension() {
		return num_pension;
	}
	public void setNum_pension(String num_pension) {
		this.num_pension = num_pension;
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
	public CertificatCceDTO getCertificat() {
		return certificat;
	}
	public void setCertificat(CertificatCceDTO certificat) {
		this.certificat = certificat;
	}
	public List<SeSituerCceDTO> getSesituer() {
		return sesituer;
	}
	public void setSesituer(List<SeSituerCceDTO> sesituer) {
		this.sesituer = sesituer;
	}
	public AgentCceDTO(Long idAgent, String nom, String prenom, String civilite, String num_pension, String caisse,
			String assignation, String additionalInfo, LocalDate dateDece, LocalDate dateAnnulation,
			CertificatCceDTO certificat, List<SeSituerCceDTO> sesituer) {
		super();
		this.idAgent = idAgent;
		this.nom = nom;
		this.prenom = prenom;
		this.civilite = civilite;
		this.num_pension = num_pension;
		this.caisse = caisse;
		this.assignation = assignation;
		this.additionalInfo = additionalInfo;
		this.dateDece = dateDece;
		this.dateAnnulation = dateAnnulation;
		this.certificat = certificat;
		this.sesituer = sesituer;
	}
	public AgentCceDTO() {
		super();
	}
    
    
}
