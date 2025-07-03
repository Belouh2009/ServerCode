package Finance.Backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Finance.Backend.Model.RubriquePension;

public interface RubriquePensionRepository extends JpaRepository<RubriquePension, String> {

    Optional<RubriquePension> findById(String idRubrique);
    
    // Corriger la requête pour utiliser le bon nom de classe 'RubriquePension' et la bonne propriété 'idRubrique'
    @Query("SELECT r.idRubrique FROM RubriquePension r")
    List<String> findAllRubriqueIds();
}
