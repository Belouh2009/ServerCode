package Finance.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.Bareme;

public interface BaremeRepository extends JpaRepository<Bareme, Long> {
  boolean existsByDatebaremeAndCategorieAndIndice(
      java.time.LocalDate datebareme, Integer categorie, Integer indice);

}
