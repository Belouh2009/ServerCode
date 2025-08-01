package Finance.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.AgentCce;
import Finance.Backend.Model.RubriquePension;
import Finance.Backend.Model.SesituerCce;

public interface SeSituerCceRepository extends JpaRepository<SesituerCce, Long> {

    // 🔍 Récupérer tous les enregistrements par id_agent
    List<SesituerCce> findByAgentcce_IdAgent(Long idAgent);  // Remplacer "agent" par "agentcce"
    
    // 🔍 Récupérer tous les enregistrements par agent et rubrique
    List<SesituerCce> findByAgentcceAndRubrique(AgentCce agent, RubriquePension rubrique);
    
    // Méthode pour supprimer les rubriques associées à un agent
    void deleteByAgentcce(AgentCce agent);
}

