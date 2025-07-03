package Finance.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Finance.Backend.Model.CertificatCcpsRect;
import Finance.Backend.Repository.CertificatCcpsRectRepository;
import Finance.Backend.Service.CertificatCcpsRectService;

@RestController
@RequestMapping("/certificatsCcpsRect")
@CrossOrigin("*")
public class CertificatCcpsRectController {

	@Autowired
    private CertificatCcpsRectService certificatCasService;

	
	private final CertificatCcpsRectRepository certificatRepository;

    public CertificatCcpsRectController(CertificatCcpsRectRepository certificatRepository) {
        this.certificatRepository = certificatRepository;
    }

    @GetMapping("/lastId")
    public ResponseEntity<String> getLastCertificatId() {
        // Obtenir le dernier id_certificat trié par ordre décroissant (ex : "0005-2025")
        String lastId = certificatRepository.findTopByOrderByIdCertificatDesc()
                .map(CertificatCcpsRect::getIdCertificat)
                .orElse(null); // Retourner null s'il n'y a pas de certificat

        return ResponseEntity.ok(lastId != null ? lastId : "0000-2025"); // Retourner un ID par défaut si aucun trouvé
    }
    
    
    @GetMapping("/count")
    public long getCertificatCount() {
        return certificatCasService.countCertificats();
    }
}
