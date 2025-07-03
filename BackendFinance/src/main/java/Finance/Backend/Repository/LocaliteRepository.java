package Finance.Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Finance.Backend.Model.Localite;

@Repository
public interface LocaliteRepository extends JpaRepository<Localite, Long> {

    @Query("SELECT l.nom FROM Localite l")
    List<String> findAllLocaliteNames();
}
