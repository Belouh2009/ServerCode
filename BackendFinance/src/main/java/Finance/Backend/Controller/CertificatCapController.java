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

import Finance.Backend.Model.CertificatCap;
import Finance.Backend.Repository.CertificatCapRepository;
import Finance.Backend.Service.CertificatCapService;

@RestController
@RequestMapping("/certificats")
@CrossOrigin("*")
public class CertificatCapController {

    @Autowired
    private CertificatCapService certificatCapService;

    private final CertificatCapRepository certificatRepository;

    public CertificatCapController(CertificatCapRepository certificatRepository) {
        this.certificatRepository = certificatRepository;
    }

    @GetMapping("/lastId")
    public ResponseEntity<String> getLastCertificatId() {
        String lastId = certificatRepository.findTopByOrderByIdCertificatDesc()
                .map(CertificatCap::getIdCertificat)
                .orElse(null);

        return ResponseEntity.ok(lastId != null ? lastId : "0000-2025");
    }

    @GetMapping("/count")
    public long getCertificatCount() {
        return certificatCapService.countCertificats();
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

                    CertificatCap misAJour = certificatRepository.save(certificat);
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