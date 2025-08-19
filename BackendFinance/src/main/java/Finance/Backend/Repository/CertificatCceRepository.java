package Finance.Backend.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import Finance.Backend.Model.CertificatCce;

public interface CertificatCceRepository extends JpaRepository<CertificatCce, String> {

    Optional<CertificatCce> findTopByOrderByIdCertificatDesc();

    @Query("SELECT c FROM CertificatCce c WHERE c.idCertificat = :id")
    Optional<CertificatCce> trouverParId(@Param("id") String id);

    boolean existsByIdCertificat(String idCertificat);
}