package Finance.Backend.DTO;

import java.time.LocalDate;

public class AgentCasDTO {

private String matricule;
	
	private String nom;
	
	private String prenom;
	
	private String corps;
	
	private String grade;
	
	private String indice;
	
	private String chapitre;
	
	private String localite;
	
	private LocalDate dateDebut;
	
	private LocalDate dateFin;
	
	private LocalDate datePrise;
	
	private String referenceActe;
	
	private LocalDate dateActe;
	
	private String acte;

    private CertificatCasDTO certificat;

	public String getMatricule() {
		return matricule;
	}

	public void setMatricule(String matricule) {
		this.matricule = matricule;
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

	public String getChapitre() {
		return chapitre;
	}

	public void setChapitre(String chapitre) {
		this.chapitre = chapitre;
	}

	public String getLocalite() {
		return localite;
	}

	public void setLocalite(String localite) {
		this.localite = localite;
	}

	public LocalDate getDateDebut() {
		return dateDebut;
	}

	public void setDateDebut(LocalDate dateDebut) {
		this.dateDebut = dateDebut;
	}

	public LocalDate getDateFin() {
		return dateFin;
	}

	public void setDateFin(LocalDate dateFin) {
		this.dateFin = dateFin;
	}

	public LocalDate getDatePrise() {
		return datePrise;
	}

	public void setDatePrise(LocalDate datePrise) {
		this.datePrise = datePrise;
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

	public String getActe() {
		return acte;
	}

	public void setActe(String acte) {
		this.acte = acte;
	}

	public CertificatCasDTO getCertificat() {
		return certificat;
	}

	public void setCertificat(CertificatCasDTO certificat) {
		this.certificat = certificat;
	}

	public AgentCasDTO(String matricule, String nom, String prenom, String corps, String grade, String indice,
			String chapitre, String localite, LocalDate dateDebut, LocalDate dateFin, LocalDate datePrise,
			String referenceActe, LocalDate dateActe, String acte, CertificatCasDTO certificat) {
		super();
		this.matricule = matricule;
		this.nom = nom;
		this.prenom = prenom;
		this.corps = corps;
		this.grade = grade;
		this.indice = indice;
		this.chapitre = chapitre;
		this.localite = localite;
		this.dateDebut = dateDebut;
		this.dateFin = dateFin;
		this.datePrise = datePrise;
		this.referenceActe = referenceActe;
		this.dateActe = dateActe;
		this.acte = acte;
		this.certificat = certificat;
	}

	public AgentCasDTO() {
		super();
	}
    
    
}
