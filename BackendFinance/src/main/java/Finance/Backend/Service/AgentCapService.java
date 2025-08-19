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
        AgentCap agent = agentRepository.findById(idAgent).orElseThrow(() -> new RuntimeException("Agent not found"));
        List<SesituerCap> sesituerList = seSituerRepository.findByAgent_IdAgent(idAgent);

        AgentCapDTO agentDTO = new AgentCapDTO();
        agentDTO.setIdAgent(agent.getIdAgent());
        agentDTO.setNom(agent.getNom());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setCivilite(agent.getCivilite());
        agentDTO.setNum_pension(agent.getNumPension());
        agentDTO.setCaisse(agent.getCaisse());
        agentDTO.setAssignation(agent.getAssignation());
        agentDTO.setAdditionalInfo(agent.getAdditionalInfo());

        agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

        if (agent.getCertificat() != null) {
            agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
        }

        return agentDTO;
    }

    public List<AgentCapDTO> getAllAgentsWithSesituer() {
        return agentRepository.findAll().stream().map(agent -> {
            AgentCapDTO agentDTO = new AgentCapDTO();
            agentDTO.setIdAgent(agent.getIdAgent());
            agentDTO.setNom(agent.getNom());
            agentDTO.setPrenom(agent.getPrenom());
            agentDTO.setCivilite(agent.getCivilite());
            agentDTO.setNum_pension(agent.getNumPension());
            agentDTO.setCaisse(agent.getCaisse());
            agentDTO.setAssignation(agent.getAssignation());
            agentDTO.setAdditionalInfo(agent.getAdditionalInfo());

            List<SesituerCap> sesituerList = seSituerRepository.findByAgent_IdAgent(agent.getIdAgent());
            agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

            if (agent.getCertificat() != null) {
                agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
            }

            return agentDTO;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void enregistrerImpressionCertificat(String idCertificat, String username) {
        CertificatCap certificat = certificatRepository.findById(idCertificat)
                .orElseThrow(() -> new RuntimeException("Certificat non trouvé"));

        certificat.setDateImpression(LocalDate.now());
        certificatRepository.save(certificat);
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
        if (certificat == null)
            return null;
        CertificatCapDTO certificatDTO = new CertificatCapDTO();
        certificatDTO.setId_certificat(certificat.getIdCertificat());
        certificatDTO.setDate_creation(certificat.getDateCreation());
        certificatDTO.setDateImpression(certificat.getDateImpression());
        certificatDTO.setAjout_par(certificat.getAjoutPar());
        certificatDTO.setModif_par(certificat.getModifPar());
        return certificatDTO;
    }

    @Transactional
    public AgentCapDTO saveOrUpdateAgent(AgentCapDTO agentDTO) {
        System.out.println("ID de l'agent reçu : " + agentDTO.getIdAgent());

        AgentCap agent = agentRepository.findByIdWithSesituer(agentDTO.getIdAgent())
                .orElseThrow(() -> new RuntimeException("Agent non trouvé avec l'ID " + agentDTO.getIdAgent()));

        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setCivilite(agentDTO.getCivilite());
        agent.setNumPension(agentDTO.getNum_pension());
        agent.setCaisse(agentDTO.getCaisse());
        agent.setAssignation(agentDTO.getAssignation());
        agent.setAdditionalInfo(agentDTO.getAdditionalInfo());

        if (agentDTO.getCertificat() != null) {
            CertificatCap certificat = agent.getCertificat();

            if (certificat == null) {
                certificat = new CertificatCap();
                certificat.setIdCertificat(agentDTO.getCertificat().getId_certificat());
                certificat.setAjoutPar(agentDTO.getCertificat().getAjout_par());
            }

            certificat.setDateCreation(agentDTO.getCertificat().getDate_creation());
            certificat.setModifPar(agentDTO.getCertificat().getModif_par());
            agent.setCertificat(certificat);
        }

        agent.getSesituer().clear();
        if (agentDTO.getSesituer() != null) {
            for (SeSituerCapDTO sesituerDTO : agentDTO.getSesituer()) {
                RubriquePension rubrique = rubriqueRepository.findById(sesituerDTO.getRubrique().getId_rubrique())
                        .orElseThrow(() -> new RuntimeException("Rubrique non trouvée"));

                SesituerCap sesituerCap = new SesituerCap();
                sesituerCap.setAgent(agent);
                sesituerCap.setRubrique(rubrique);
                sesituerCap.setMontant(sesituerDTO.getMontant());

                agent.getSesituer().add(sesituerCap);
            }
        }

        agent = agentRepository.save(agent);
        return mapAgentToDTO(agent);
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
            certificatDTO.setDateImpression(agent.getCertificat().getDateImpression());
            certificatDTO.setAjout_par(agent.getCertificat().getAjoutPar());
            certificatDTO.setModif_par(agent.getCertificat().getModifPar());
            agentDTO.setCertificat(certificatDTO);
        }

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