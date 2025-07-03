package Finance.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.AgentsCcps;
import Finance.Backend.Model.RubriqueSolde;
import Finance.Backend.Model.SesituerCcps;

public interface SeSituerCcpsRepository extends JpaRepository<SesituerCcps, Long>{

    // 🔍 Récupérer tous les enregistrements par id_agent
	List<SesituerCcps> findByAgentccps_Matricule(String matricule);
    
    // 🔍 Récupérer tous les enregistrements par agent et rubrique
    List<SesituerCcps> findByAgentccpsAndRubrique(AgentsCcps agent, RubriqueSolde rubrique);
    
    
    // Méthode pour supprimer les rubriques associées à un agent
    void deleteByAgentccps(AgentsCcps agent);
}
