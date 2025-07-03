package Finance.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.Model.CertificatCas;
import Finance.Backend.Repository.CertificatCasRepository;
import Finance.Backend.Service.CertificatCasService;

@RestController
@RequestMapping("/certificatsCas")
@CrossOrigin("*")
public class CertificatCasController {

	@Autowired
    private CertificatCasService certificatCasService;

	
	private final CertificatCasRepository certificatRepository;

    public CertificatCasController(CertificatCasRepository certificatRepository) {
        this.certificatRepository = certificatRepository;
    }

    @GetMapping("/lastId")
    public ResponseEntity<String> getLastCertificatId() {
        // Obtenir le dernier id_certificat trié par ordre décroissant (ex : "0005-2025")
        String lastId = certificatRepository.findTopByOrderByIdCertificatDesc()
                .map(CertificatCas::getIdCertificat)
                .orElse(null); // Retourner null s'il n'y a pas de certificat

        return ResponseEntity.ok(lastId != null ? lastId : "0000-2025"); // Retourner un ID par défaut si aucun trouvé
    }
    
    
    @GetMapping("/count")
    public long getCertificatCount() {
        return certificatCasService.countCertificats();
    }
}
