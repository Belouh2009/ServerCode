package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import Finance.Backend.Model.AgentCap;

public interface AgentCapRepository extends JpaRepository<AgentCap, Long> {

	@Query("SELECT a FROM AgentCap a LEFT JOIN FETCH a.sesituer WHERE a.idAgent = :idAgent")
	Optional<AgentCap> findByIdWithSesituer(@Param("idAgent") Long idAgent);
	
	Optional<AgentCap> findById(Long id);

}
