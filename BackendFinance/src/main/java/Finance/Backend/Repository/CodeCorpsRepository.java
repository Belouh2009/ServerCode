package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.CodeCorps;

public interface CodeCorpsRepository extends JpaRepository<CodeCorps, String> {

	  Optional<CodeCorps> findById(String idCorps);
}
