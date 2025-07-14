package Finance.Backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import Finance.Backend.Service.BanqueService;

@RestController
@RequestMapping("/comptables")
@CrossOrigin(origins = "*")
public class BanqueController {
    private final BanqueService banqueService;

    public BanqueController(BanqueService banqueService) {
        this.banqueService = banqueService;
    }

    @GetMapping("/banques")
    public ResponseEntity<List<String>> getNomBanques() {
        return ResponseEntity.ok(banqueService.getAllNomBanque());
    }
}
