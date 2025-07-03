package Finance.Backend.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import Finance.Backend.DTO.AgentCapDTO;
import Finance.Backend.DTO.CertificatCapDTO;
import Finance.Backend.DTO.RubriqueDTO;
import Finance.Backend.DTO.SeSituerCapDTO;
import Finance.Backend.Exception.RubriqueNotFoundException;
import Finance.Backend.Model.AgentCap;
import Finance.Backend.Model.CertificatCap;
import Finance.Backend.Model.RubriquePension;
import Finance.Backend.Model.SesituerCap;
import Finance.Backend.Repository.AgentCapRepository;
import Finance.Backend.Repository.CertificatCapRepository;
import Finance.Backend.Repository.RubriquePensionRepository;
import Finance.Backend.Repository.SeSituerCapRepository;
import jakarta.transaction.Transactional;

@Service
public class AgentCapService {

    private final AgentCapRepository agentRepository;
    private final CertificatCapRepository certificatRepository;
    private final RubriquePensionRepository rubriqueRepository;
    private final SeSituerCapRepository seSituerRepository;

    public AgentCapService(AgentCapRepository agentRepository, CertificatCapRepository certificatRepository,
                           RubriquePensionRepository rubriqueRepository, SeSituerCapRepository seSituerRepository) {
        this.agentRepository = agentRepository;
        this.certificatRepository = certificatRepository;
        this.rubriqueRepository = rubriqueRepository;
        this.seSituerRepository = seSituerRepository;
    }
    
    @Transactional
    public AgentCap enregistrerAgent(AgentCapDTO agentDTO) {
        // 1️⃣ Enregistrement du certificat (avec Optional)
        CertificatCap certificat = Optional.ofNullable(agentDTO.getCertificat())
                .map(cert -> {
                    CertificatCap newCertificat = new CertificatCap();
                    newCertificat.setIdCertificat(cert.getId_certificat());
                    newCertificat.setDateCreation(LocalDate.parse(cert.getDate_creation().toString()));
                    newCertificat.setAjoutPar(cert.getAjout_par());
                    newCertificat.setModifPar(cert.getModif_par());
                    return certificatRepository.save(newCertificat);
                }).orElse(null);

        // 2️⃣ Enregistrement de l'agent
        AgentCap agent = new AgentCap();
        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setCivilite(agentDTO.getCivilite());
        agent.setNumPension(agentDTO.getNum_pension());
        agent.setCaisse(agentDTO.getCaisse());
        agent.setAssignation(agentDTO.getAssignation());
        agent.setAdditionalInfo(agentDTO.getAdditionalInfo());
        agent.setCertificat(certificat);
        agent = agentRepository.save(agent);

        // 3️⃣ Enregistrement des relations `SeSituer` avec exception personnalisée
        for (SeSituerCapDTO seSituerDTO : agentDTO.getSesituer()) {
            RubriquePension rubrique = rubriqueRepository.findById(seSituerDTO.getRubrique().getId_rubrique())
                .orElseThrow(() -> new RubriqueNotFoundException("Rubrique avec id " 
                             + seSituerDTO.getRubrique().getId_rubrique() + " non trouvée"));

            SesituerCap seSituer = new SesituerCap();
            seSituer.setAgent(agent);
            seSituer.setRubrique(rubrique);
            seSituer.setMontant(seSituerDTO.getMontant());
            seSituerRepository.save(seSituer);
        }

        return agent;
    }


    public AgentCapDTO getAgentWithSesituer(Long idAgent) {
        // Récupérer l'agent
        AgentCap agent = agentRepository.findById(idAgent).orElseThrow(() -> new RuntimeException("Agent not found"));

        // Récupérer les rubriques liées à cet agent
        List<SesituerCap> sesituerList = seSituerRepository.findByAgent_IdAgent(idAgent);

        // Mapper les données dans AgentCapDTO
        AgentCapDTO agentDTO = new AgentCapDTO();
        agentDTO.setIdAgent(agent.getIdAgent()); // Ajouter l'ID de l'agent
        agentDTO.setNom(agent.getNom());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setCivilite(agent.getCivilite());
        agentDTO.setNum_pension(agent.getNumPension());
        agentDTO.setCaisse(agent.getCaisse());
        agentDTO.setAssignation(agent.getAssignation());
        agentDTO.setAdditionalInfo(agent.getAdditionalInfo());

        // Associer les rubriques à l'agent
        agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

        // Associer le certificat
        if (agent.getCertificat() != null) {
            agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
        }

        return agentDTO;
    }


    public List<AgentCapDTO> getAllAgentsWithSesituer() {
        // Récupérer tous les agents
        List<AgentCap> agents = agentRepository.findAll();

        // Mapper les agents avec leurs informations
        return agents.stream().map(agent -> {
            // Créer le DTO de l'agent
            AgentCapDTO agentDTO = new AgentCapDTO();
            agentDTO.setIdAgent(agent.getIdAgent()); // Ajouter l'ID de l'agent
            agentDTO.setNom(agent.getNom());
            agentDTO.setPrenom(agent.getPrenom());
            agentDTO.setCivilite(agent.getCivilite());
            agentDTO.setNum_pension(agent.getNumPension());
            agentDTO.setCaisse(agent.getCaisse());
            agentDTO.setAssignation(agent.getAssignation());
            agentDTO.setAdditionalInfo(agent.getAdditionalInfo());

            // Récupérer les rubriques liées à cet agent dans SeSituer
            List<SesituerCap> sesituerList = seSituerRepository.findByAgent_IdAgent(agent.getIdAgent());
            agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

            // Associer le certificat à l'agent si existant
            if (agent.getCertificat() != null) {
                agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
            }

            return agentDTO;
        }).collect(Collectors.toList());
    }


    /*** MÉTHODES DE MAPPING ***/

    private List<SeSituerCapDTO> mapSesituerToDTO(List<SesituerCap> sesituerList) {
        return sesituerList.stream().map(s -> {
            SeSituerCapDTO sesituerDTO = new SeSituerCapDTO();
            RubriqueDTO rubriqueDTO = new RubriqueDTO();
            rubriqueDTO.setId_rubrique(s.getRubrique().getIdRubrique());
            rubriqueDTO.setLibelle(s.getRubrique().getLibelle());

            sesituerDTO.setRubrique(rubriqueDTO);
            sesituerDTO.setMontant(s.getMontant());
            return sesituerDTO;
        }).collect(Collectors.toList());
    }

    private CertificatCapDTO mapCertificatToDTO(CertificatCap certificat) {
        if (certificat == null) return null;
        CertificatCapDTO certificatDTO = new CertificatCapDTO();
        certificatDTO.setId_certificat(certificat.getIdCertificat());
        certificatDTO.setDate_creation(certificat.getDateCreation());
        certificatDTO.setAjout_par(certificat.getAjoutPar());
        certificatDTO.setModif_par(certificat.getModifPar());
        return certificatDTO;
    }
    
    @Transactional
    public AgentCapDTO saveOrUpdateAgent(AgentCapDTO agentDTO) {
        System.out.println("ID de l'agent reçu : " + agentDTO.getIdAgent());

        // Récupérer l'agent existant avec son certificat et ses rubriques
        AgentCap agent = agentRepository.findByIdWithSesituer(agentDTO.getIdAgent())
                .orElseThrow(() -> new RuntimeException("Agent non trouvé avec l'ID " + agentDTO.getIdAgent()));

        // Mise à jour des champs de l'agent
        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setCivilite(agentDTO.getCivilite());
        agent.setNumPension(agentDTO.getNum_pension());
        agent.setCaisse(agentDTO.getCaisse());
        agent.setAssignation(agentDTO.getAssignation());
        agent.setAdditionalInfo(agentDTO.getAdditionalInfo());

        // Mise à jour du certificat (sans modifier l'ID ni le champ ajout_par)
        if (agentDTO.getCertificat() != null) {
            CertificatCap certificat = agent.getCertificat();  // Récupérer le certificat actuel

            if (certificat == null) {
                // Si aucun certificat n'est associé, créer un nouveau certificat
                certificat = new CertificatCap();
                certificat.setIdCertificat(agentDTO.getCertificat().getId_certificat());  // Conserver l'ID si présent
                certificat.setAjoutPar(agentDTO.getCertificat().getAjout_par());  // Ajout initial
            }

            // Mettre à jour uniquement les champs nécessaires
            certificat.setDateCreation(agentDTO.getCertificat().getDate_creation());
            certificat.setModifPar(agentDTO.getCertificat().getModif_par());
            agent.setCertificat(certificat);  // Lier le certificat à l'agent
        }

        // Suppression des rubriques précédentes et ajout des nouvelles
        agent.getSesituer().clear();
        if (agentDTO.getSesituer() != null) {
            for (SeSituerCapDTO sesituerDTO : agentDTO.getSesituer()) {
                RubriquePension rubrique = rubriqueRepository.findById(sesituerDTO.getRubrique().getId_rubrique())
                        .orElseThrow(() -> new RuntimeException("Rubrique non trouvée"));

                SesituerCap sesituerCap = new SesituerCap();
                sesituerCap.setAgent(agent);
                sesituerCap.setRubrique(rubrique);
                sesituerCap.setMontant(sesituerDTO.getMontant());

                agent.getSesituer().add(sesituerCap);  // Ajouter à la liste
            }
        }

        agent = agentRepository.save(agent);  // Sauvegarde en cascade
        return mapAgentToDTO(agent);  // Mapper et retourner l'agent mis à jour
    }



    private AgentCapDTO mapAgentToDTO(AgentCap agent) {
        AgentCapDTO agentDTO = new AgentCapDTO();
        agentDTO.setIdAgent(agent.getIdAgent());
        agentDTO.setNom(agent.getNom());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setCivilite(agent.getCivilite());
        agentDTO.setNum_pension(agent.getNumPension());
        agentDTO.setCaisse(agent.getCaisse());
        agentDTO.setAssignation(agent.getAssignation());
        agentDTO.setAdditionalInfo(agent.getAdditionalInfo());

        if (agent.getCertificat() != null) {
            CertificatCapDTO certificatDTO = new CertificatCapDTO();
            certificatDTO.setId_certificat(agent.getCertificat().getIdCertificat());
            certificatDTO.setDate_creation(agent.getCertificat().getDateCreation());
            certificatDTO.setAjout_par(agent.getCertificat().getAjoutPar());
            certificatDTO.setModif_par(agent.getCertificat().getModifPar());
            agentDTO.setCertificat(certificatDTO);
        }

        // Mapper les rubriques associées
        List<SeSituerCapDTO> sesituerDTOs = agent.getSesituer().stream().map(sesituerCap -> {
            SeSituerCapDTO sesituerDTO = new SeSituerCapDTO();
            RubriqueDTO rubriqueDTO = new RubriqueDTO();
            rubriqueDTO.setId_rubrique(sesituerCap.getRubrique().getIdRubrique());
            rubriqueDTO.setLibelle(sesituerCap.getRubrique().getLibelle());
            sesituerDTO.setRubrique(rubriqueDTO);
            sesituerDTO.setMontant(sesituerCap.getMontant());
            return sesituerDTO;
        }).collect(Collectors.toList());
        agentDTO.setSesituer(sesituerDTOs);

        return agentDTO;
    }
    
}
