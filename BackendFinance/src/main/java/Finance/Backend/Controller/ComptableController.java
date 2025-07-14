package Finance.Backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import Finance.Backend.Service.ComptableService;

@RestController
@RequestMapping("/comptables")
@CrossOrigin(origins = "*")
public class ComptableController {

    private final ComptableService service;

    public ComptableController(ComptableService service) {
        this.service = service;
    }

    @GetMapping("/liste")
    public ResponseEntity<List<String>> getNomComptables() {
        return ResponseEntity.ok(service.getAllNomComptable());
    }
}
