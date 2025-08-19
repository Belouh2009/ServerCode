package Finance.Backend.Controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.Model.CertificatCce;
import Finance.Backend.Repository.CertificatCceRepository;
import Finance.Backend.Service.CertificatCceService;

@RestController
@RequestMapping("/certificatsCce")
@CrossOrigin("*")
public class CertificatCceController {

    @Autowired
    private CertificatCceService certificatCceService;

    private final CertificatCceRepository certificatRepository;

    public CertificatCceController(CertificatCceRepository certificatRepository) {
        this.certificatRepository = certificatRepository;
    }

    @GetMapping("/lastId")
    public ResponseEntity<String> getLastCertificatId() {
        // Obtenir le dernier id_certificat trié par ordre décroissant (ex :
        // "0005-2025")
        String lastId = certificatRepository.findTopByOrderByIdCertificatDesc()
                .map(CertificatCce::getIdCertificat)
                .orElse(null); // Retourner null s'il n'y a pas de certificat

        return ResponseEntity.ok(lastId != null ? lastId : "0000-2025"); // Retourner un ID par défaut si aucun trouvé
    }

    @GetMapping("/count")
    public long getCertificatCount() {
        return certificatCceService.countCertificats();
    }

    @PutMapping("/{id}/imprimer")
    public ResponseEntity<?> enregistrerImpression(
            @PathVariable String id,
            @RequestHeader("X-User") String utilisateur) {

        return certificatRepository.trouverParId(id)
                .map(certificat -> {
                    // Supprimer cette vérification pour permettre les impressions multiples
                    certificat.setDateImpression(LocalDate.now());
                    certificat.setImprimePar(utilisateur);

                    CertificatCce misAJour = certificatRepository.save(certificat);
                    return ResponseEntity.ok(misAJour);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/verifier-impression")
    public ResponseEntity<Boolean> verifierImpression(@PathVariable String id) {
        return ResponseEntity.ok(
                certificatRepository.findById(id)
                        .map(c -> c.getDateImpression() != null)
                        .orElse(false));
    }
}
