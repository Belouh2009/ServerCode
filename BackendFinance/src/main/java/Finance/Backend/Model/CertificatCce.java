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

    private String ajoutPar;
    private String modifPar;
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
	public CertificatCce(String idCertificat, LocalDate dateCreation, String ajoutPar, String modifPar) {
		super();
		this.idCertificat = idCertificat;
		this.dateCreation = dateCreation;
		this.ajoutPar = ajoutPar;
		this.modifPar = modifPar;
	}
	public CertificatCce() {
		super();
	}
    
    
    
}
