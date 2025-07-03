package Finance.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Finance.Backend.Model.CodeZone;

@Repository
public interface CodeZoneRepository extends JpaRepository<CodeZone, Long> {

}
