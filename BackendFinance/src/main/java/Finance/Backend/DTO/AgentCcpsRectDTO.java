package Finance.Backend.DTO;

import java.time.LocalDate;
import java.util.List;

public class AgentCcpsRectDTO {

private String matricule;
	
	private String civilite;
	
	private String nom;
	
	private String prenom;
	
	private String enfant;
	
	private String localite;
	
	private String cessationService;
	
	private String corps;
	
	private String grade;
	
	private String indice;
	
	private Long zone;
	
	private String chapitre;
	
	private String article;
	
	private String acte;
	
	private String referenceActe;
	
	private LocalDate dateActe;
	
	private LocalDate dateCessation;
	
	private LocalDate dateFinPai;
	
	private Double montant;

	private String referenceRecette;
	
	private LocalDate dateOrdreRecette;
	
	private LocalDate dateDebut;
	
	private LocalDate dateDernierPai;
	
	private String idCertificatRect;
	
    private CertificatCcpsDTO certificat;
    
    private List<SeSituerCcpsRectDTO> sesituer;

	public String getMatricule() {
		return matricule;
	}

	public void setMatricule(String matricule) {
		this.matricule = matricule;
	}

	public String getCivilite() {
		return civilite;
	}

	public void setCivilite(String civilite) {
		this.civilite = civilite;
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

	public String getEnfant() {
		return enfant;
	}

	public void setEnfant(String enfant) {
		this.enfant = enfant;
	}

	public String getLocalite() {
		return localite;
	}

	public void setLocalite(String localite) {
		this.localite = localite;
	}

	public String getCessationService() {
		return cessationService;
	}

	public void setCessationService(String cessationService) {
		this.cessationService = cessationService;
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

	public String getIndice() {
		return indice;
	}

	public void setIndice(String indice) {
		this.indice = indice;
	}

	public Long getZone() {
		return zone;
	}

	public void setZone(Long zone) {
		this.zone = zone;
	}

	public String getChapitre() {
		return chapitre;
	}

	public void setChapitre(String chapitre) {
		this.chapitre = chapitre;
	}

	public String getArticle() {
		return article;
	}

	public void setArticle(String article) {
		this.article = article;
	}

	public String getActe() {
		return acte;
	}

	public void setActe(String acte) {
		this.acte = acte;
	}

	public String getReferenceActe() {
		return referenceActe;
	}

	public void setReferenceActe(String referenceActe) {
		this.referenceActe = referenceActe;
	}

	public LocalDate getDateActe() {
		return dateActe;
	}

	public void setDateActe(LocalDate dateActe) {
		this.dateActe = dateActe;
	}

	public LocalDate getDateCessation() {
		return dateCessation;
	}

	public void setDateCessation(LocalDate dateCessation) {
		this.dateCessation = dateCessation;
	}

	public LocalDate getDateFinPai() {
		return dateFinPai;
	}

	public void setDateFinPai(LocalDate dateFinPai) {
		this.dateFinPai = dateFinPai;
	}

	public Double getMontant() {
		return montant;
	}

	public void setMontant(Double montant) {
		this.montant = montant;
	}

	public String getReferenceRecette() {
		return referenceRecette;
	}

	public void setReferenceRecette(String referenceRecette) {
		this.referenceRecette = referenceRecette;
	}

	public LocalDate getDateOrdreRecette() {
		return dateOrdreRecette;
	}

	public void setDateOrdreRecette(LocalDate dateOrdreRecette) {
		this.dateOrdreRecette = dateOrdreRecette;
	}

	public LocalDate getDateDebut() {
		return dateDebut;
	}

	public void setDateDebut(LocalDate dateDebut) {
		this.dateDebut = dateDebut;
	}

	public LocalDate getDateDernierPai() {
		return dateDernierPai;
	}

	public void setDateDernierPai(LocalDate dateDernierPai) {
		this.dateDernierPai = dateDernierPai;
	}

	public String getIdCertificatRect() {
		return idCertificatRect;
	}

	public void setIdCertificatRect(String idCertificatRect) {
		this.idCertificatRect = idCertificatRect;
	}

	public CertificatCcpsDTO getCertificat() {
		return certificat;
	}

	public void setCertificat(CertificatCcpsDTO certificat) {
		this.certificat = certificat;
	}

	public List<SeSituerCcpsRectDTO> getSesituer() {
		return sesituer;
	}

	public void setSesituer(List<SeSituerCcpsRectDTO> sesituer) {
		this.sesituer = sesituer;
	}

	public AgentCcpsRectDTO(String matricule, String civilite, String nom, String prenom, String enfant,
			String localite, String cessationService, String corps, String grade, String indice, Long zone,
			String chapitre, String article, String acte, String referenceActe, LocalDate dateActe,
			LocalDate dateCessation, LocalDate dateFinPai, Double montant, String referenceRecette,
			LocalDate dateOrdreRecette, LocalDate dateDebut, LocalDate dateDernierPai, String idCertificatRect,
			CertificatCcpsDTO certificat, List<SeSituerCcpsRectDTO> sesituer) {
		super();
		this.matricule = matricule;
		this.civilite = civilite;
		this.nom = nom;
		this.prenom = prenom;
		this.enfant = enfant;
		this.localite = localite;
		this.cessationService = cessationService;
		this.corps = corps;
		this.grade = grade;
		this.indice = indice;
		this.zone = zone;
		this.chapitre = chapitre;
		this.article = article;
		this.acte = acte;
		this.referenceActe = referenceActe;
		this.dateActe = dateActe;
		this.dateCessation = dateCessation;
		this.dateFinPai = dateFinPai;
		this.montant = montant;
		this.referenceRecette = referenceRecette;
		this.dateOrdreRecette = dateOrdreRecette;
		this.dateDebut = dateDebut;
		this.dateDernierPai = dateDernierPai;
		this.idCertificatRect = idCertificatRect;
		this.certificat = certificat;
		this.sesituer = sesituer;
	}

	public AgentCcpsRectDTO() {
		super();
	}

	
}
