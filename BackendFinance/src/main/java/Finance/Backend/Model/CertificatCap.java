package Finance.Backend.Model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "certificat")
public class CertificatCap {

    @Id
    @Column(length = 10, unique = true)
    private String idCertificat;

    @Column(nullable = false, updatable = false)
    private LocalDate dateCreation;

    @Column(nullable = true)
    private LocalDate dateImpression;

    private String ajoutPar;
    private String modifPar;
    private String imprimePar; // Champ ajouté pour la traçabilité

    // Constructeurs
    public CertificatCap() {}

    public CertificatCap(String idCertificat, LocalDate dateCreation, String ajoutPar) {
        this.idCertificat = idCertificat;
        this.dateCreation = dateCreation;
        this.ajoutPar = ajoutPar;
    }

    // Getters et Setters
    public String getIdCertificat() {
        return idCertificat;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public LocalDate getDateImpression() {
        return dateImpression;
    }

    public String getAjoutPar() {
        return ajoutPar;
    }

    public String getModifPar() {
        return modifPar;
    }

    public String getImprimePar() {
        return imprimePar;
    }
		

    public void setIdCertificat(String idCertificat) {
			this.idCertificat = idCertificat;
		}

		public void setDateCreation(LocalDate dateCreation) {
			this.dateCreation = dateCreation;
		}

		public void setAjoutPar(String ajoutPar) {
			this.ajoutPar = ajoutPar;
		}

		public void setModifPar(String modifPar) {
			this.modifPar = modifPar;
		}

		// Setters avec validation
    public void setDateImpression(LocalDate dateImpression) {
        if(dateImpression.isBefore(this.dateCreation)) {
            throw new IllegalArgumentException("La date d'impression ne peut pas être antérieure à la création");
        }
        this.dateImpression = dateImpression;
    }

    public void setImprimePar(String imprimePar) {
        this.imprimePar = imprimePar;
    }
}