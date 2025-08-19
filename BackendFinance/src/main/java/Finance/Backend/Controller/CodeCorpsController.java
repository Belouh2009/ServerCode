package Finance.Backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Finance.Backend.Model.CodeCorps;
import Finance.Backend.Repository.CodeCorpsRepository;
import Finance.Backend.Service.CodeCorpsService;

@RestController
@RequestMapping("/corps")
@CrossOrigin("*")
public class CodeCorpsController {

    @Autowired
    private CodeCorpsService corpsService;

    @Autowired
    private CodeCorpsRepository corpsRepository;

    // Importation des corps
    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importCorps(@RequestBody List<CodeCorps> corpsList) {
        Map<String, String> response = new HashMap<>();
        try {
            corpsService.saveCorps(corpsList);
            response.put("message", "Les données ont été importées avec succès !");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Erreur lors de l'importation des données : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Récupération de tous les corps (toutes les colonnes)
    @GetMapping("/all")
    public ResponseEntity<List<CodeCorps>> getAllCorps() {
        return ResponseEntity.ok(corpsService.getAllCorps());
    }

    // Modification d’un corps
    @PutMapping("/modifier/{id}")
    public ResponseEntity<Map<String, String>> modifierCorps(@PathVariable("id") Long id,
            @RequestBody CodeCorps corps) {
        Map<String, String> response = new HashMap<>();
        try {
            corpsService.updateCorps(id, corps);
            response.put("message", "Code Corps mis à jour avec succès !");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Erreur lors de la mise à jour du corps : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Récupération des valeurs distinctes de la colonne "corps"
    @GetMapping("/distinct")
    public ResponseEntity<List<String>> getDistinctCorps() {
        return ResponseEntity.ok(corpsRepository.findDistinctCorps());
    }

    // Récupération des grades + indices d’un corps donné
    @GetMapping("/grades")
    public ResponseEntity<List<Map<String, Object>>> getGradesWithIndices(@RequestParam String corps) {
        return ResponseEntity.ok(corpsRepository.findGradesWithIndices(corps));
    }

    @GetMapping("/libelle/{codeCorps}")
    public ResponseEntity<String> getLibelleByCorps(@PathVariable String codeCorps) {
        return corpsRepository.findFirstLibelleByCorps(codeCorps)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
