package Finance.Backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Finance.Backend.Model.RubriqueSolde;

public interface RubriqueSoldeRepository extends JpaRepository<RubriqueSolde, String> {

    Optional<RubriqueSolde> findById(String idRubrique);
    
    @Query("SELECT r.idRubrique FROM RubriqueSolde r")
    List<String> findAllRubriqueIds();
}
