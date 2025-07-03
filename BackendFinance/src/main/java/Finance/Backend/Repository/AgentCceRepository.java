package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import Finance.Backend.Model.AgentCce;

public interface AgentCceRepository extends JpaRepository<AgentCce, Long> {

    @Query("SELECT a FROM AgentCce a LEFT JOIN FETCH a.sesituer WHERE a.idAgent = :idAgent")
    Optional<AgentCce> findByIdWithSesituer(@Param("idAgent") Long idAgent);
	
	Optional<AgentCce> findById(Long id);
}
