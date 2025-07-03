package Finance.Backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Finance.Backend.DTO.AgentCasDTO;
import Finance.Backend.DTO.CertificatCasDTO;
import Finance.Backend.Model.AgentCas;
import Finance.Backend.Model.CertificatCas;
import Finance.Backend.Repository.AgentCasRepository;
import Finance.Backend.Repository.CertificatCasRepository;
import jakarta.transaction.Transactional;

@Service
public class AgentCasService {

    private final AgentCasRepository agentCasRepository;
    private final CertificatCasRepository certificatRepository;

    @Autowired
    public AgentCasService(AgentCasRepository agentCasRepository, CertificatCasRepository certificatRepository) {
        this.agentCasRepository = agentCasRepository;
        this.certificatRepository = certificatRepository;
    }

    // Enregistrement d'un agent avec son certificat
    @Transactional
    public AgentCas enregistrerAgent(AgentCasDTO agentDTO) {
        // Vérifier et enregistrer le certificat s'il existe
        CertificatCas certificat = null;
        if (agentDTO.getCertificat() != null) {
            certificat = convertToCertificatCas(agentDTO.getCertificat());
            certificat = certificatRepository.save(certificat);
        }

        // Création de l'agent
        AgentCas agent = new AgentCas();
        mapAgentDTOToEntity(agentDTO, agent);
        agent.setCertificat(certificat);

        // Sauvegarde de l'agent
        return agentCasRepository.save(agent);
    }

    // Mise à jour d'un agent existant via son matricule
    @Transactional
    public AgentCasDTO saveOrUpdateAgent(String matricule, AgentCasDTO agentDTO) {
        // Vérifier si l'agent existe
        AgentCas agent = agentCasRepository.findByMatricule(matricule)
                .orElseThrow(() -> new RuntimeException("Agent non trouvé avec le matricule " + matricule));

        // Mise à jour des informations de l'agent
        mapAgentDTOToEntity(agentDTO, agent);

        // Mise à jour du certificat si nécessaire
        if (agentDTO.getCertificat() != null) {
            updateOrCreateCertificat(agentDTO.getCertificat(), agent);
        }

        // Sauvegarde des modifications
        agent = agentCasRepository.save(agent);
        return mapAgentToDTO(agent);
    }

    // Récupérer tous les agents
    public List<AgentCas> getAllAgents() {
        return agentCasRepository.findAll();
    }

    // Mapper DTO vers CertificatCas
    private CertificatCas convertToCertificatCas(CertificatCasDTO certificatDTO) {
        CertificatCas certificat = new CertificatCas();
        certificat.setIdCertificat(certificatDTO.getId_certificat());
        certificat.setDateCreation(certificatDTO.getDate_creation());
        certificat.setAjoutPar(certificatDTO.getAjout_par());
        certificat.setModifPar(certificatDTO.getModif_par());
        return certificat;
    }

    // Mise à jour ou création du certificat
    private void updateOrCreateCertificat(CertificatCasDTO certDTO, AgentCas agent) {
        CertificatCas certificat = agent.getCertificat();

        if (certificat == null) {
            certificat = new CertificatCas();
            certificat.setIdCertificat(certDTO.getId_certificat());
            certificat.setAjoutPar(certDTO.getAjout_par());
        }

        certificat.setDateCreation(certDTO.getDate_creation());
        certificat.setModifPar(certDTO.getModif_par());

        // Sauvegarde du certificat
        certificat = certificatRepository.save(certificat);
        agent.setCertificat(certificat);
    }

    // Mapper DTO vers entité AgentCas
    private void mapAgentDTOToEntity(AgentCasDTO agentDTO, AgentCas agent) {
        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setMatricule(agentDTO.getMatricule());
        agent.setCorps(agentDTO.getCorps());
        agent.setGrade(agentDTO.getGrade());
        agent.setIndice(agentDTO.getIndice());
        agent.setChapitre(agentDTO.getChapitre());
        agent.setLocalite(agentDTO.getLocalite());
        agent.setDateDebut(agentDTO.getDateDebut());
        agent.setDateFin(agentDTO.getDateFin());
        agent.setDatePrise(agentDTO.getDatePrise());
        agent.setReferenceActe(agentDTO.getReferenceActe());
        agent.setDateActe(agentDTO.getDateActe());
        agent.setActe(agentDTO.getActe());
    }

    // Mapper un agent vers son DTO
    private AgentCasDTO mapAgentToDTO(AgentCas agent) {
        AgentCasDTO dto = new AgentCasDTO();
        dto.setMatricule(agent.getMatricule());
        dto.setNom(agent.getNom());
        dto.setPrenom(agent.getPrenom());
        dto.setCorps(agent.getCorps());
        dto.setGrade(agent.getGrade());
        dto.setIndice(agent.getIndice());
        dto.setChapitre(agent.getChapitre());
        dto.setLocalite(agent.getLocalite());
        dto.setDateDebut(agent.getDateDebut());
        dto.setDateFin(agent.getDateFin());
        dto.setDatePrise(agent.getDatePrise());
        dto.setReferenceActe(agent.getReferenceActe());
        dto.setDateActe(agent.getDateActe());
        dto.setActe(agent.getActe());

        if (agent.getCertificat() != null) {
            CertificatCas certificat = agent.getCertificat();
            dto.setCertificat(new CertificatCasDTO(certificat.getIdCertificat(), certificat.getDateCreation(),
                    certificat.getAjoutPar(), certificat.getModifPar()));
        }
        return dto;
    }
}
