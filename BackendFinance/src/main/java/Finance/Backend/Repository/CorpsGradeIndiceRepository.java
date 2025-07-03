package Finance.Backend.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import Finance.Backend.Model.CorpsGradeIndice;

public interface CorpsGradeIndiceRepository extends JpaRepository<CorpsGradeIndice, Long> {

    // Méthode pour trouver une entrée par corps et grade
    Optional<CorpsGradeIndice> findByCorpsAndGrade(String corps, String grade);
    
    @Query("SELECT DISTINCT c.corps FROM CorpsGradeIndice c")
    List<String> findDistinctCorps();
    
    
    @Query("SELECT new map(c.grade as grade, c.indice as indice) FROM CorpsGradeIndice c WHERE c.corps = :corps")
    List<Map<String, Object>> findGradesWithIndices(@Param("corps") String corps);

}
