package Finance.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Finance.Backend.Model.Banque;

@Repository
public interface BanqueRepository extends JpaRepository<Banque, Long> {
}
