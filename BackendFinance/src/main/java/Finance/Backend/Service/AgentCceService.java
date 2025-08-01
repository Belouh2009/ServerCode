package Finance.Backend.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import Finance.Backend.DTO.AgentCceDTO;
import Finance.Backend.DTO.CertificatCceDTO;
import Finance.Backend.DTO.RubriqueDTO;
import Finance.Backend.DTO.SeSituerCceDTO;
import Finance.Backend.Exception.RubriqueNotFoundException;
import Finance.Backend.Model.AgentCce;
import Finance.Backend.Model.CertificatCce;
import Finance.Backend.Model.RubriquePension;
import Finance.Backend.Model.SesituerCce;
import Finance.Backend.Repository.AgentCceRepository;
import Finance.Backend.Repository.CertificatCceRepository;
import Finance.Backend.Repository.RubriquePensionRepository;
import Finance.Backend.Repository.SeSituerCceRepository;
import jakarta.transaction.Transactional;

@Service
public class AgentCceService {

	private final AgentCceRepository agentRepository;
    private final CertificatCceRepository certificatRepository;
    private final RubriquePensionRepository rubriqueRepository;
    private final SeSituerCceRepository seSituerRepository;

    public AgentCceService(AgentCceRepository agentRepository, CertificatCceRepository certificatRepository,
                           RubriquePensionRepository rubriqueRepository, SeSituerCceRepository seSituerRepository) {
        this.agentRepository = agentRepository;
        this.certificatRepository = certificatRepository;
        this.rubriqueRepository = rubriqueRepository;
        this.seSituerRepository = seSituerRepository;
    }
    
    @Transactional
    public AgentCce enregistrerAgent(AgentCceDTO agentDTO) {
        // 1️⃣ Enregistrement du certificat (avec Optional)
        CertificatCce certificat = Optional.ofNullable(agentDTO.getCertificat())
                .map(cert -> {
                    CertificatCce newCertificat = new CertificatCce();
                    newCertificat.setIdCertificat(cert.getId_certificat());
                    newCertificat.setDateCreation(LocalDate.parse(cert.getDate_creation().toString()));
                    newCertificat.setAjoutPar(cert.getAjout_par());
                    newCertificat.setModifPar(cert.getModif_par());
                    return certificatRepository.save(newCertificat);
                }).orElse(null);

        // 2️⃣ Enregistrement de l'agent
        AgentCce agent = new AgentCce();
        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setCivilite(agentDTO.getCivilite());
        agent.setNumPension(agentDTO.getNum_pension());
        agent.setCaisse(agentDTO.getCaisse());
        agent.setAssignation(agentDTO.getAssignation());
        agent.setAdditionalInfo(agentDTO.getAdditionalInfo());
        agent.setDateDece(agentDTO.getDateDece());
        agent.setDateAnnulation(agentDTO.getDateAnnulation());
        agent.setCertificat(certificat);
        agent = agentRepository.save(agent);

        // 3️⃣ Enregistrement des relations `SeSituer` avec exception personnalisée
        for (SeSituerCceDTO seSituerDTO : agentDTO.getSesituer()) {
            RubriquePension rubrique = rubriqueRepository.findById(seSituerDTO.getRubrique().getId_rubrique())
                .orElseThrow(() -> new RubriqueNotFoundException("Rubrique avec id " 
                             + seSituerDTO.getRubrique().getId_rubrique() + " non trouvée"));

            SesituerCce seSituer = new SesituerCce();
            seSituer.setAgent(agent);
            seSituer.setRubrique(rubrique);
            seSituer.setMontant(seSituerDTO.getMontant());
            seSituerRepository.save(seSituer);
        }

        return agent;
    }


    public AgentCceDTO getAgentWithSesituer(Long idAgent) {
        // Récupérer l'agent
        AgentCce agent = agentRepository.findById(idAgent).orElseThrow(() -> new RuntimeException("Agent not found"));

        // Récupérer les rubriques liées à cet agent
        List<SesituerCce> sesituerList = seSituerRepository.findByAgentcce_IdAgent(idAgent);

        // Mapper les données dans AgentCapDTO
        AgentCceDTO agentDTO = new AgentCceDTO();
        agentDTO.setIdAgent(agent.getIdAgent()); // Ajouter l'ID de l'agent
        agentDTO.setNom(agent.getNom());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setCivilite(agent.getCivilite());
        agentDTO.setNum_pension(agent.getNumPension());
        agentDTO.setCaisse(agent.getCaisse());
        agentDTO.setAssignation(agent.getAssignation());
        agentDTO.setAdditionalInfo(agent.getAdditionalInfo());
        agentDTO.setDateDece(agent.getDateDece());
        agentDTO.setDateAnnulation(agent.getDateAnnulation());

        // Associer les rubriques à l'agent
        agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

        // Associer le certificat
        if (agent.getCertificat() != null) {
            agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
        }

        return agentDTO;
    }


    public List<AgentCceDTO> getAllAgentsWithSesituer() {
        // Récupérer tous les agents
        List<AgentCce> agents = agentRepository.findAll();

        // Mapper les agents avec leurs informations
        return agents.stream().map(agent -> {
            // Créer le DTO de l'agent
            AgentCceDTO agentDTO = new AgentCceDTO();
            agentDTO.setIdAgent(agent.getIdAgent()); // Ajouter l'ID de l'agent
            agentDTO.setNom(agent.getNom());
            agentDTO.setPrenom(agent.getPrenom());
            agentDTO.setCivilite(agent.getCivilite());
            agentDTO.setNum_pension(agent.getNumPension());
            agentDTO.setCaisse(agent.getCaisse());
            agentDTO.setAssignation(agent.getAssignation());
            agentDTO.setAdditionalInfo(agent.getAdditionalInfo());
            agentDTO.setDateDece(agent.getDateDece());
            agentDTO.setDateAnnulation(agent.getDateAnnulation());

            // Récupérer les rubriques liées à cet agent dans SeSituer
            List<SesituerCce> sesituerList = seSituerRepository.findByAgentcce_IdAgent(agent.getIdAgent());
            agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

            // Associer le certificat à l'agent si existant
            if (agent.getCertificat() != null) {
                agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
            }

            return agentDTO;
        }).collect(Collectors.toList());
    }


    /*** MÉTHODES DE MAPPING ***/

    private List<SeSituerCceDTO> mapSesituerToDTO(List<SesituerCce> sesituerList) {
        return sesituerList.stream().map(s -> {
            SeSituerCceDTO sesituerDTO = new SeSituerCceDTO();
            RubriqueDTO rubriqueDTO = new RubriqueDTO();
            rubriqueDTO.setId_rubrique(s.getRubrique().getIdRubrique());
            rubriqueDTO.setLibelle(s.getRubrique().getLibelle());

            sesituerDTO.setRubrique(rubriqueDTO);
            sesituerDTO.setMontant(s.getMontant());
            return sesituerDTO;
        }).collect(Collectors.toList());
    }

    private CertificatCceDTO mapCertificatToDTO(CertificatCce certificat) {
        if (certificat == null) return null;
        CertificatCceDTO certificatDTO = new CertificatCceDTO();
        certificatDTO.setId_certificat(certificat.getIdCertificat());
        certificatDTO.setDate_creation(certificat.getDateCreation());
        certificatDTO.setAjout_par(certificat.getAjoutPar());
        certificatDTO.setModif_par(certificat.getModifPar());
        return certificatDTO;
    }
    
    @Transactional
    public AgentCceDTO saveOrUpdateAgent(AgentCceDTO agentDTO) {
        System.out.println("ID de l'agent reçu : " + agentDTO.getIdAgent());

        // Récupérer l'agent existant avec son certificat et ses rubriques
        AgentCce agent = agentRepository.findByIdWithSesituer(agentDTO.getIdAgent())
                .orElseThrow(() -> new RuntimeException("Agent non trouvé avec l'ID " + agentDTO.getIdAgent()));

        // Mise à jour des champs de l'agent
        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setCivilite(agentDTO.getCivilite());
        agent.setNumPension(agentDTO.getNum_pension());
        agent.setCaisse(agentDTO.getCaisse());
        agent.setAssignation(agentDTO.getAssignation());
        agent.setAdditionalInfo(agentDTO.getAdditionalInfo());
        agent.setDateDece(agentDTO.getDateDece());
        agent.setDateAnnulation(agentDTO.getDateAnnulation());

        // Mise à jour du certificat (sans modifier l'ID ni le champ ajout_par)
        if (agentDTO.getCertificat() != null) {
            CertificatCce certificat = agent.getCertificat();  // Récupérer le certificat actuel

            if (certificat == null) {
                // Si aucun certificat n'est associé, créer un nouveau certificat
                certificat = new CertificatCce();
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
            for (SeSituerCceDTO sesituerDTO : agentDTO.getSesituer()) {
                RubriquePension rubrique = rubriqueRepository.findById(sesituerDTO.getRubrique().getId_rubrique())
                        .orElseThrow(() -> new RuntimeException("Rubrique non trouvée"));

                SesituerCce sesituerCce = new SesituerCce();
                sesituerCce.setAgent(agent);
                sesituerCce.setRubrique(rubrique);
                sesituerCce.setMontant(sesituerDTO.getMontant());

                agent.getSesituer().add(sesituerCce);  // Ajouter à la liste
            }
        }

        agent = agentRepository.save(agent);  // Sauvegarde en cascade
        return mapAgentToDTO(agent);  // Mapper et retourner l'agent mis à jour
    }



    private AgentCceDTO mapAgentToDTO(AgentCce agent) {
        AgentCceDTO agentDTO = new AgentCceDTO();
        agentDTO.setIdAgent(agent.getIdAgent());
        agentDTO.setNom(agent.getNom());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setCivilite(agent.getCivilite());
        agentDTO.setNum_pension(agent.getNumPension());
        agentDTO.setCaisse(agent.getCaisse());
        agentDTO.setAssignation(agent.getAssignation());
        agentDTO.setAdditionalInfo(agent.getAdditionalInfo());
        agentDTO.setDateDece(agent.getDateDece());
        agentDTO.setDateAnnulation(agent.getDateAnnulation());

        if (agent.getCertificat() != null) {
            CertificatCceDTO certificatDTO = new CertificatCceDTO();
            certificatDTO.setId_certificat(agent.getCertificat().getIdCertificat());
            certificatDTO.setDate_creation(agent.getCertificat().getDateCreation());
            certificatDTO.setAjout_par(agent.getCertificat().getAjoutPar());
            certificatDTO.setModif_par(agent.getCertificat().getModifPar());
            agentDTO.setCertificat(certificatDTO);
        }

        // Mapper les rubriques associées
        List<SeSituerCceDTO> sesituerDTOs = agent.getSesituer().stream().map(sesituerCce -> {
            SeSituerCceDTO sesituerDTO = new SeSituerCceDTO();
            RubriqueDTO rubriqueDTO = new RubriqueDTO();
            rubriqueDTO.setId_rubrique(sesituerCce.getRubrique().getIdRubrique());
            rubriqueDTO.setLibelle(sesituerCce.getRubrique().getLibelle());
            sesituerDTO.setRubrique(rubriqueDTO);
            sesituerDTO.setMontant(sesituerCce.getMontant());
            return sesituerDTO;
        }).collect(Collectors.toList());
        agentDTO.setSesituer(sesituerDTOs);

        return agentDTO;
    }
}