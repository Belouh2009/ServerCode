package Finance.Backend.DTO;

import java.util.List;

public class AgentCapDTO {

    private Long idAgent; // Ajout du champ id_agent
    private String nom;
    private String prenom;
    private String civilite;
    private String num_pension;
    private String caisse;
    private String assignation;
    private String additionalInfo;
    private CertificatCapDTO certificat;
    private List<SeSituerCapDTO> sesituer;

    // Getters et setters
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

    public CertificatCapDTO getCertificat() {
        return certificat;
    }

    public void setCertificat(CertificatCapDTO certificat) {
        this.certificat = certificat;
    }

    public List<SeSituerCapDTO> getSesituer() {
        return sesituer;
    }

    public void setSesituer(List<SeSituerCapDTO> sesituer) {
        this.sesituer = sesituer;
    }

    public AgentCapDTO(String nom, String prenom, String civilite, String num_pension, String caisse,
            String assignation, String additionalInfo, CertificatCapDTO certificat, List<SeSituerCapDTO> sesituer) {
        super();
        this.nom = nom;
        this.prenom = prenom;
        this.civilite = civilite;
        this.num_pension = num_pension;
        this.caisse = caisse;
        this.assignation = assignation;
        this.additionalInfo = additionalInfo;
        this.certificat = certificat;
        this.sesituer = sesituer;
    }

    public AgentCapDTO() {
        super();
    }
}
