package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import Finance.Backend.Model.AgentsCcps;

public interface AgentCcpsRepository extends JpaRepository<AgentsCcps, String> {

    @Query("SELECT a FROM AgentsCcps a LEFT JOIN FETCH a.sesituer WHERE a.matricule = :matricule")
    Optional<AgentsCcps> findByIdWithSesituer(@Param("matricule") String matricule);

    Optional<AgentsCcps> findByMatricule(String matricule); // pour support plus classique
}

