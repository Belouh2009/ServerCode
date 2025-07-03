package Finance.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.Model.CertificatCcps;
import Finance.Backend.Repository.CertificatCcpsRepository;
import Finance.Backend.Service.CertificatCcpsService;

@RestController
@RequestMapping("/certificatsCcps")
@CrossOrigin("*")
public class CertificatCcpsController {

	@Autowired
    private CertificatCcpsService certificatCasService;

	
	private final CertificatCcpsRepository certificatRepository;

    public CertificatCcpsController(CertificatCcpsRepository certificatRepository) {
        this.certificatRepository = certificatRepository;
    }

    @GetMapping("/lastId")
    public ResponseEntity<String> getLastCertificatId() {
        // Obtenir le dernier id_certificat trié par ordre décroissant (ex : "0005-2025")
        String lastId = certificatRepository.findTopByOrderByIdCertificatDesc()
                .map(CertificatCcps::getIdCertificat)
                .orElse(null); // Retourner null s'il n'y a pas de certificat

        return ResponseEntity.ok(lastId != null ? lastId : "0000-2025"); // Retourner un ID par défaut si aucun trouvé
    }
    
    
    @GetMapping("/count")
    public long getCertificatCount() {
        return certificatCasService.countCertificats();
    }
}
