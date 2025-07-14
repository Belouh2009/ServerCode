package Finance.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Finance.Backend.Model.Comptable;

import java.util.List;

public interface ComptableRepository extends JpaRepository<Comptable, Long> {

  @Query("SELECT c.nom_comptable FROM Comptable c")
  List<String> findAllNomComptable();

}
