package Finance.Backend.Model;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "agentcas")
public class AgentCas {

	@Id
	@Column(unique = true)
	private String matricule;
	
	private String nom;
	
	private String prenom;
	
	private String corps;
	
	private String grade;
	
	private String indice;
	
	private String chapitre;
	
	private String localite;
	
	@Column(name = "datedebut")
	private LocalDate dateDebut;
	
	@Column(name = "datefin")
	private LocalDate dateFin;
	
	@Column(name = "dateprise")
	private LocalDate datePrise;
	
	@Column(name = "referenceacte")
	private String referenceActe;
	
	@Column(name = "dateacte")
	private LocalDate dateActe;
	
	private String acte;

    @OneToOne(cascade = CascadeType.ALL) // Prise en charge de l'insertion ou mise à jour du certificat
    @JoinColumn(name = "id_certificat", referencedColumnName = "idCertificat", unique = true, nullable = true)
    private CertificatCas certificat;

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

	public CertificatCas getCertificat() {
		return certificat;
	}

	public void setCertificat(CertificatCas certificat) {
		this.certificat = certificat;
	}

	public AgentCas(String matricule, String nom, String prenom, String corps, String grade, String indice,
			String chapitre, String localite, LocalDate dateDebut, LocalDate dateFin, LocalDate datePrise,
			String referenceActe, LocalDate dateActe, String acte, CertificatCas certificat) {
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

	public AgentCas() {
		super();
	}
	
}
