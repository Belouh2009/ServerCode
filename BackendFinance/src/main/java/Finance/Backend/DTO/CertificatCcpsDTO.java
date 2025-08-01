package Finance.Backend.DTO;

import java.time.LocalDate;

public class CertificatCcpsDTO {

    private String id_certificat;
    private LocalDate date_creation;
    private String ajout_par;
    private String modif_par;
	public String getId_certificat() {
		return id_certificat;
	}
	public void setId_certificat(String id_certificat) {
		this.id_certificat = id_certificat;
	}
	public LocalDate getDate_creation() {
		return date_creation;
	}
	public void setDate_creation(LocalDate date_creation) {
		this.date_creation = date_creation;
	}
	public String getAjout_par() {
		return ajout_par;
	}
	public void setAjout_par(String ajout_par) {
		this.ajout_par = ajout_par;
	}
	public String getModif_par() {
		return modif_par;
	}
	public void setModif_par(String modif_par) {
		this.modif_par = modif_par;
	}
	public CertificatCcpsDTO(String id_certificat, LocalDate date_creation, String ajout_par, String modif_par) {
		super();
		this.id_certificat = id_certificat;
		this.date_creation = date_creation;
		this.ajout_par = ajout_par;
		this.modif_par = modif_par;
	}
	public CertificatCcpsDTO() {
		super();
	}
    
    
}
