package Finance.Backend.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import Finance.Backend.DTO.AgentCcpsDTO;
import Finance.Backend.DTO.CertificatCcpsDTO;
import Finance.Backend.DTO.RubriqueSoldeDTO;
import Finance.Backend.DTO.SeSituerCcpsDTO;
import Finance.Backend.Exception.RubriqueNotFoundException;
import Finance.Backend.Model.AgentsCcps;
import Finance.Backend.Model.CertificatCcps;
import Finance.Backend.Model.RubriqueSolde;
import Finance.Backend.Model.SesituerCcps;
import Finance.Backend.Repository.AgentCcpsRepository;
import Finance.Backend.Repository.CertificatCcpsRepository;
import Finance.Backend.Repository.RubriqueSoldeRepository;
import Finance.Backend.Repository.SeSituerCcpsRepository;
import jakarta.transaction.Transactional;

@Service
public class AgentCcpsService {

	private final AgentCcpsRepository agentRepository;
    private final CertificatCcpsRepository certificatRepository;
    private final RubriqueSoldeRepository rubriqueRepository;
    private final SeSituerCcpsRepository seSituerRepository;

    public AgentCcpsService(AgentCcpsRepository agentRepository, CertificatCcpsRepository certificatRepository,
                           RubriqueSoldeRepository rubriqueRepository, SeSituerCcpsRepository seSituerRepository) {
        this.agentRepository = agentRepository;
        this.certificatRepository = certificatRepository;
        this.rubriqueRepository = rubriqueRepository;
        this.seSituerRepository = seSituerRepository;
    }
    
    @Transactional
    public AgentsCcps enregistrerAgent(AgentCcpsDTO agentDTO) {
        // 1️⃣ Enregistrement du certificat (avec Optional)
        CertificatCcps certificat = Optional.ofNullable(agentDTO.getCertificat())
                .map(cert -> {
                    CertificatCcps newCertificat = new CertificatCcps();
                    newCertificat.setIdCertificat(cert.getId_certificat());
                    newCertificat.setDateCreation(LocalDate.parse(cert.getDate_creation().toString()));
                    newCertificat.setAjoutPar(cert.getAjout_par());
                    newCertificat.setModifPar(cert.getModif_par());
                    return certificatRepository.save(newCertificat);
                }).orElse(null);

        // 2️⃣ Enregistrement de l'agent avec tous les attributs
        AgentsCcps agent = new AgentsCcps();
        agent.setMatricule(agentDTO.getMatricule());
        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setCivilite(agentDTO.getCivilite());
        agent.setEnfant(agentDTO.getEnfant());
        agent.setLocalite(agentDTO.getLocalite());
        agent.setCessationService(agentDTO.getCessationService());
        agent.setCorps(agentDTO.getCorps());
        agent.setGrade(agentDTO.getGrade());
        agent.setIndice(agentDTO.getIndice());
        agent.setZone(agentDTO.getZone());
        agent.setChapitre(agentDTO.getChapitre());
        agent.setArticle(agentDTO.getArticle());
        agent.setActe(agentDTO.getActe());
        agent.setReferenceActe(agentDTO.getReferenceActe());
        agent.setDateActe(agentDTO.getDateActe());
        agent.setDateCessation(agentDTO.getDateCessation());
        agent.setDateFinPai(agentDTO.getDateFinPai());
        agent.setMontant(agentDTO.getMontant());
        agent.setReferenceRecette(agentDTO.getReferenceRecette());
        agent.setDateOrdreRecette(agentDTO.getDateOrdreRecette());
        agent.setDateDebut(agentDTO.getDateDebut());
        agent.setDateDernierPai(agentDTO.getDateDernierPai());
        agent.setCertificat(certificat);

        agent = agentRepository.save(agent);

        // 3️⃣ Enregistrement des relations `SeSituer` avec exception personnalisée
        for (SeSituerCcpsDTO seSituerDTO : agentDTO.getSesituer()) {
            RubriqueSolde rubrique = rubriqueRepository.findById(seSituerDTO.getRubrique().getId_rubrique())
                .orElseThrow(() -> new RubriqueNotFoundException("Rubrique avec id " 
                             + seSituerDTO.getRubrique().getId_rubrique() + " non trouvée"));

            SesituerCcps seSituer = new SesituerCcps();
            seSituer.setAgentccps(agent);
            seSituer.setRubrique(rubrique);
            seSituer.setMontant(seSituerDTO.getMontant());
            seSituerRepository.save(seSituer);
        }

        return agent;
    }


    public AgentCcpsDTO getAgentWithSesituer(String matricule) {
        // Récupérer l'agent
        AgentsCcps agent = agentRepository.findById(matricule)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        // Récupérer les rubriques liées à cet agent
        List<SesituerCcps> sesituerList = seSituerRepository.findByAgentccps_Matricule(matricule);

        // Mapper les données dans AgentCcpsDTO
        AgentCcpsDTO agentDTO = new AgentCcpsDTO();
        agentDTO.setMatricule(agent.getMatricule());
        agentDTO.setCivilite(agent.getCivilite());
        agentDTO.setNom(agent.getNom());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setEnfant(agent.getEnfant());
        agentDTO.setLocalite(agent.getLocalite());
        agentDTO.setCessationService(agent.getCessationService());
        agentDTO.setCorps(agent.getCorps());
        agentDTO.setGrade(agent.getGrade());
        agentDTO.setIndice(agent.getIndice());
        agentDTO.setZone(agent.getZone());
        agentDTO.setChapitre(agent.getChapitre());
        agentDTO.setArticle(agent.getArticle());
        agentDTO.setActe(agent.getActe());
        agentDTO.setReferenceActe(agent.getReferenceActe());
        agentDTO.setDateActe(agent.getDateActe());
        agentDTO.setDateCessation(agent.getDateCessation());
        agentDTO.setDateFinPai(agent.getDateFinPai());
        agentDTO.setMontant(agent.getMontant());
        agentDTO.setReferenceRecette(agent.getReferenceRecette());
        agentDTO.setDateOrdreRecette(agent.getDateOrdreRecette());
        agentDTO.setDateDebut(agent.getDateDebut());
        agentDTO.setDateDernierPai(agent.getDateDernierPai());

        // Associer les rubriques à l'agent
        agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

        // Associer le certificat si existant
        if (agent.getCertificat() != null) {
            agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
        }

        return agentDTO;
    }


    public List<AgentCcpsDTO> getAllAgentsWithSesituer() {
        // Récupérer tous les agents
        List<AgentsCcps> agents = agentRepository.findAll();

        // Mapper les agents avec leurs informations
        return agents.stream().map(agent -> {
            // Créer le DTO de l'agent
            AgentCcpsDTO agentDTO = new AgentCcpsDTO();
            agentDTO.setMatricule(agent.getMatricule());
            agentDTO.setCivilite(agent.getCivilite());
            agentDTO.setNom(agent.getNom());
            agentDTO.setPrenom(agent.getPrenom());
            agentDTO.setEnfant(agent.getEnfant());
            agentDTO.setLocalite(agent.getLocalite());
            agentDTO.setCessationService(agent.getCessationService());
            agentDTO.setCorps(agent.getCorps());
            agentDTO.setGrade(agent.getGrade());
            agentDTO.setIndice(agent.getIndice());
            agentDTO.setZone(agent.getZone());
            agentDTO.setChapitre(agent.getChapitre());
            agentDTO.setArticle(agent.getArticle());
            agentDTO.setActe(agent.getActe());
            agentDTO.setReferenceActe(agent.getReferenceActe());
            agentDTO.setDateActe(agent.getDateActe());
            agentDTO.setDateCessation(agent.getDateCessation());
            agentDTO.setDateFinPai(agent.getDateFinPai());
            agentDTO.setMontant(agent.getMontant());
            agentDTO.setReferenceRecette(agent.getReferenceRecette());
            agentDTO.setDateOrdreRecette(agent.getDateOrdreRecette());
            agentDTO.setDateDebut(agent.getDateDebut());
            agentDTO.setDateDernierPai(agent.getDateDernierPai());

            // Récupérer les rubriques liées à cet agent dans SeSituer
            List<SesituerCcps> sesituerList = seSituerRepository.findByAgentccps_Matricule(agent.getMatricule());
            agentDTO.setSesituer(mapSesituerToDTO(sesituerList));

            // Associer le certificat à l'agent si existant
            if (agent.getCertificat() != null) {
                agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
            }

            return agentDTO;
        }).collect(Collectors.toList());
    }


    /*** MÉTHODES DE MAPPING ***/

    private List<SeSituerCcpsDTO> mapSesituerToDTO(List<SesituerCcps> sesituerList) {
        return sesituerList.stream().map(s -> {
            SeSituerCcpsDTO sesituerDTO = new SeSituerCcpsDTO();
            RubriqueSoldeDTO rubriqueDTO = new RubriqueSoldeDTO();
            rubriqueDTO.setId_rubrique(s.getRubrique().getIdRubrique());
            rubriqueDTO.setLibelle(s.getRubrique().getLibelle());

            sesituerDTO.setRubrique(rubriqueDTO);
            sesituerDTO.setMontant(s.getMontant());
            return sesituerDTO;
        }).collect(Collectors.toList());
    }

    private CertificatCcpsDTO mapCertificatToDTO(CertificatCcps certificat) {
        if (certificat == null) return null;
        CertificatCcpsDTO certificatDTO = new CertificatCcpsDTO();
        certificatDTO.setId_certificat(certificat.getIdCertificat());
        certificatDTO.setDate_creation(certificat.getDateCreation());
        certificatDTO.setAjout_par(certificat.getAjoutPar());
        certificatDTO.setModif_par(certificat.getModifPar());
        return certificatDTO;
    }
    
    @Transactional
    public AgentCcpsDTO saveOrUpdateAgent(AgentCcpsDTO agentDTO) {
        System.out.println("ID de l'agent reçu : " + agentDTO.getMatricule());

        // Récupérer l'agent existant avec son certificat et ses rubriques
        AgentsCcps agent = agentRepository.findByIdWithSesituer(agentDTO.getMatricule())
                .orElseThrow(() -> new RuntimeException("Agent non trouvé avec l'ID " + agentDTO.getMatricule()));

        // Mise à jour des champs de l'agent
        agent.setNom(agentDTO.getNom());
        agent.setPrenom(agentDTO.getPrenom());
        agent.setCivilite(agentDTO.getCivilite());
        agent.setEnfant(agentDTO.getEnfant());
        agent.setLocalite(agentDTO.getLocalite());
        agent.setCessationService(agentDTO.getCessationService());
        agent.setCorps(agentDTO.getCorps());
        agent.setGrade(agentDTO.getGrade());
        agent.setIndice(agentDTO.getIndice());
        agent.setZone(agentDTO.getZone());
        agent.setChapitre(agentDTO.getChapitre());
        agent.setArticle(agentDTO.getArticle());
        agent.setActe(agentDTO.getActe());
        agent.setReferenceActe(agentDTO.getReferenceActe());
        agent.setDateActe(agentDTO.getDateActe());
        agent.setDateCessation(agentDTO.getDateCessation());
        agent.setDateFinPai(agentDTO.getDateFinPai());
        agent.setMontant(agentDTO.getMontant());
        agent.setReferenceRecette(agentDTO.getReferenceRecette());
        agent.setDateOrdreRecette(agentDTO.getDateOrdreRecette());
        agent.setDateDebut(agentDTO.getDateDebut());
        agent.setDateDernierPai(agentDTO.getDateDernierPai());

        // Mise à jour du certificat
        if (agentDTO.getCertificat() != null) {
            CertificatCcps certificat = agent.getCertificat();  // Récupérer le certificat actuel

            if (certificat == null) {
                // Si aucun certificat n'est associé, créer un nouveau certificat
                certificat = new CertificatCcps();
                certificat.setIdCertificat(agentDTO.getCertificat().getId_certificat());
                certificat.setAjoutPar(agentDTO.getCertificat().getAjout_par());
            }

            // Mettre à jour uniquement les champs nécessaires
            certificat.setDateCreation(agentDTO.getCertificat().getDate_creation());
            certificat.setModifPar(agentDTO.getCertificat().getModif_par());
            agent.setCertificat(certificat);  // Lier le certificat à l'agent
        }

        // Suppression des rubriques précédentes et ajout des nouvelles
        agent.getSesituer().clear();
        if (agentDTO.getSesituer() != null) {
            for (SeSituerCcpsDTO sesituerDTO : agentDTO.getSesituer()) {
                RubriqueSolde rubrique = rubriqueRepository.findById(sesituerDTO.getRubrique().getId_rubrique())
                        .orElseThrow(() -> new RuntimeException("Rubrique non trouvée"));

                SesituerCcps sesituerCap = new SesituerCcps();
                sesituerCap.setAgentccps(agent);
                sesituerCap.setRubrique(rubrique);
                sesituerCap.setMontant(sesituerDTO.getMontant());

                agent.getSesituer().add(sesituerCap);  // Ajouter à la liste
            }
        }

        agent = agentRepository.save(agent);  // Sauvegarde en cascade
        return mapAgentToDTO(agent);  // Mapper et retourner l'agent mis à jour
    }




    private AgentCcpsDTO mapAgentToDTO(AgentsCcps agent) {
        AgentCcpsDTO agentDTO = new AgentCcpsDTO();
        agentDTO.setMatricule(agent.getMatricule());
        agentDTO.setNom(agent.getNom());
        agentDTO.setPrenom(agent.getPrenom());
        agentDTO.setCivilite(agent.getCivilite());
        agentDTO.setEnfant(agent.getEnfant());
        agentDTO.setLocalite(agent.getLocalite());
        agentDTO.setCessationService(agent.getCessationService());
        agentDTO.setCorps(agent.getCorps());
        agentDTO.setGrade(agent.getGrade());
        agentDTO.setIndice(agent.getIndice());
        agentDTO.setZone(agent.getZone());
        agentDTO.setChapitre(agent.getChapitre());
        agentDTO.setArticle(agent.getArticle());
        agentDTO.setActe(agent.getActe());
        agentDTO.setReferenceActe(agent.getReferenceActe());
        agentDTO.setDateActe(agent.getDateActe());
        agentDTO.setDateCessation(agent.getDateCessation());
        agentDTO.setDateFinPai(agent.getDateFinPai());
        agentDTO.setMontant(agent.getMontant());
        agentDTO.setReferenceRecette(agent.getReferenceRecette());
        agentDTO.setDateOrdreRecette(agent.getDateOrdreRecette());
        agentDTO.setDateDebut(agent.getDateDebut());
        agentDTO.setDateDernierPai(agent.getDateDernierPai());

        // Mapper le certificat
        if (agent.getCertificat() != null) {
            agentDTO.setCertificat(mapCertificatToDTO(agent.getCertificat()));
        }

        // Mapper les rubriques associées
        List<SeSituerCcpsDTO> sesituerDTOs = agent.getSesituer().stream().map(sesituerCap -> {
            SeSituerCcpsDTO sesituerDTO = new SeSituerCcpsDTO();
            RubriqueSoldeDTO rubriqueDTO = new RubriqueSoldeDTO();
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
