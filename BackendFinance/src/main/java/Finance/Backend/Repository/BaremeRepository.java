package Finance.Backend.Repository;

import java.time.LocalDate;
import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import Finance.Backend.Model.Bareme;

public interface BaremeRepository extends JpaRepository<Bareme, Long> {
  boolean existsByDatebaremeAndCategorieAndIndice(
      java.time.LocalDate datebareme, Integer categorie, Integer indice);

  @Query("SELECT DISTINCT b.datebareme FROM Bareme b ORDER BY b.datebareme DESC")
  List<LocalDate> findDistinctDatebareme();

  @Query("SELECT DISTINCT b.categorie FROM Bareme b WHERE b.datebareme = :date ORDER BY b.categorie")
  List<Integer> findDistinctCategorieByDatebareme(@Param("date") LocalDate date);

  @Query("SELECT DISTINCT b.indice FROM Bareme b WHERE b.datebareme = :date AND b.categorie = :categorie ORDER BY b.indice")
  List<Integer> findDistinctIndiceByDatebaremeAndCategorie(
      @Param("date") LocalDate date,
      @Param("categorie") Integer categorie);

}
