package Finance.Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Finance.Backend.Model.CertificatCce;

public interface CertificatCceRepository extends JpaRepository<CertificatCce, String> {

    // Correction de la requête JPQL avec le nom exact de l'entité "CertificatCap"
    @Query("SELECT COUNT(c) FROM CertificatCce c")
	   long count(); // Méthode pour compter les certificats

    // Trouver le dernier certificat basé sur l'ID
    Optional<CertificatCce> findTopByOrderByIdCertificatDesc();
}
