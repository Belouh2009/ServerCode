package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.AgentCas;

public interface AgentCasRepository extends JpaRepository<AgentCas, String> {

	 Optional<AgentCas> findByMatricule(String matricule);

}
