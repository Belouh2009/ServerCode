package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import Finance.Backend.Model.AgentCcpsRect;

public interface AgentCcpsRectRepository extends JpaRepository<AgentCcpsRect, String> {

    @Query("SELECT a FROM AgentCcpsRect a LEFT JOIN FETCH a.sesituer WHERE a.matricule = :matricule")
    Optional<AgentCcpsRect> findByIdWithSesituer(@Param("matricule") String matricule);

    Optional<AgentCcpsRect> findByMatricule(String matricule); // pour support plus classique
}
