package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Finance.Backend.Model.CertificatCcps;

public interface CertificatCcpsRepository extends JpaRepository<CertificatCcps, String> {

    // Trouver le dernier certificat basé sur l'ID
    Optional<CertificatCcps> findTopByOrderByIdCertificatDesc();
    
    // Correction de la requête JPQL avec le nom exact de l'entité "CertificatCap"
    @Query("SELECT COUNT(c) FROM CertificatCcps c")
    long count(); // Méthode pour compter les certificats
}
