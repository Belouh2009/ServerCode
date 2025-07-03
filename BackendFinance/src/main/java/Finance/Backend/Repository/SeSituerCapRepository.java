package Finance.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.AgentCap;
import Finance.Backend.Model.RubriquePension;
import Finance.Backend.Model.SesituerCap;

public interface SeSituerCapRepository extends JpaRepository<SesituerCap, Long> {

    // 🔍 Récupérer tous les enregistrements par id_agent
    List<SesituerCap> findByAgent_IdAgent(Long idAgent);
    
    // 🔍 Récupérer tous les enregistrements par agent et rubrique
    List<SesituerCap> findByAgentAndRubrique(AgentCap agent, RubriquePension rubrique);
    
    
    // Méthode pour supprimer les rubriques associées à un agent
    void deleteByAgent(AgentCap agent);
}
