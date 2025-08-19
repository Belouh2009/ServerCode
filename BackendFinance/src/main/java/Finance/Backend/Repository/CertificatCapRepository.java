package Finance.Backend.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import Finance.Backend.Model.CertificatCap;

public interface CertificatCapRepository extends JpaRepository<CertificatCap, String> {

    Optional<CertificatCap> findTopByOrderByIdCertificatDesc();

    @Query("SELECT c FROM CertificatCap c WHERE c.idCertificat = :id")
    Optional<CertificatCap> trouverParId(String id);

    boolean existsByIdCertificat(String idCertificat);
}