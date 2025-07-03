package Finance.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.AgentCcpsRect;
import Finance.Backend.Model.RubriqueSolde;
import Finance.Backend.Model.SesituerCcpsRect;

public interface SeSituerCcpsRectRepository extends JpaRepository<SesituerCcpsRect, Long> {

    // 🔍 Récupérer tous les enregistrements par id_agent
	List<SesituerCcpsRect> findByAgentccps_Matricule(String matricule);
    
    // 🔍 Récupérer tous les enregistrements par agent et rubrique
    List<SesituerCcpsRect> findByAgentccpsAndRubrique(AgentCcpsRect agent, RubriqueSolde rubrique);
    
    
    // Méthode pour supprimer les rubriques associées à un agent
    void deleteByAgentccps(AgentCcpsRect agent);
}
