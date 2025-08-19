package Finance.Backend.Model;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "certificatcce")
public class CertificatCce {

	@Id
	@Column(length = 10)
	private String idCertificat;

	@Column(nullable = false, updatable = false)
	private LocalDate dateCreation;

	@Column(nullable = true)
	private LocalDate dateImpression;

	private String ajoutPar;
	private String modifPar;
	private String imprimePar;

	public LocalDate getDateImpression() {
		return dateImpression;
	}

	public void setDateImpression(LocalDate dateImpression) {
		if (dateImpression != null && dateCreation != null && dateImpression.isBefore(dateCreation)) {
			throw new IllegalArgumentException("La date d'impression ne peut pas être antérieure à la création");
		}
		this.dateImpression = dateImpression;
	}

	public String getImprimePar() {
		return imprimePar;
	}

	public void setImprimePar(String imprimePar) {
		this.imprimePar = imprimePar;
	}

	public String getIdCertificat() {
		return idCertificat;
	}

	public void setIdCertificat(String idCertificat) {
		this.idCertificat = idCertificat;
	}

	public LocalDate getDateCreation() {
		return dateCreation;
	}

	public void setDateCreation(LocalDate dateCreation) {
		this.dateCreation = dateCreation;
	}

	public String getAjoutPar() {
		return ajoutPar;
	}

	public void setAjoutPar(String ajoutPar) {
		this.ajoutPar = ajoutPar;
	}

	public String getModifPar() {
		return modifPar;
	}

	public void setModifPar(String modifPar) {
		this.modifPar = modifPar;
	}

	public CertificatCce(String idCertificat, LocalDate dateCreation, LocalDate dateImpression, String ajoutPar,
			String modifPar, String imprimePar) {
		this.idCertificat = idCertificat;
		this.dateCreation = dateCreation;
		this.dateImpression = dateImpression;
		this.ajoutPar = ajoutPar;
		this.modifPar = modifPar;
		this.imprimePar = imprimePar;
	}

	public CertificatCce() {
	}

}
