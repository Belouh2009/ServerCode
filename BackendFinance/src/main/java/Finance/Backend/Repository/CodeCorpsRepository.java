package Finance.Backend.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Finance.Backend.Model.CodeCorps;

@Repository
public interface CodeCorpsRepository extends JpaRepository<CodeCorps, Long> {

    Optional<CodeCorps> findByCorps(String corps);

    // Méthode pour trouver une entrée par corps et grade
    Optional<CodeCorps> findByCorpsAndGrade(String corps, String grade);

    @Query("SELECT DISTINCT c.corps FROM CodeCorps c")
    List<String> findDistinctCorps();

    @Query("SELECT new map(c.grade as grade, c.indice as indice) FROM CodeCorps c WHERE c.corps = :corps")
    List<Map<String, Object>> findGradesWithIndices(@Param("corps") String corps);

        @Query("SELECT DISTINCT c.libelleCorps FROM CodeCorps c WHERE c.corps = :codeCorps")
    Optional<String> findFirstLibelleByCorps(@Param("codeCorps") String codeCorps);

}
