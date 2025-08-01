package Finance.Backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Finance.Backend.Model.Bareme;
import Finance.Backend.Service.BaremeService;

@RestController
@RequestMapping("/bareme")
@CrossOrigin("*")
public class BaremeController {
    @Autowired
    private BaremeService baremeService;

    @GetMapping("/dates")
    public List<String> getDistinctDates() {
        return baremeService.getDistinctDatesFormatted();
    }

    @GetMapping("/categories")
    public List<Integer> getCategoriesByDate(@RequestParam String date) {
        return baremeService.getCategoriesForDate(date);
    }

    @GetMapping("/indices")
    public List<Integer> getIndicesByDateAndCategory(
            @RequestParam String date,
            @RequestParam Integer categorie) {
        return baremeService.getIndicesForDateAndCategory(date, categorie);
    }

    // Endpoint pour importer une liste de barèmes
    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importBaremes(@RequestBody List<Bareme> baremeList) {
        Map<String, String> response = new HashMap<>();
        try {
            baremeService.saveAllBaremes(baremeList);
            response.put("message", "Les barèmes ont été importés avec succès !");
            return ResponseEntity
                    .ok()
                    .header("Content-Type", "application/json") // Ajout facultatif si problème
                    .body(response);
        } catch (Exception e) {
            response.put("message", "Erreur lors de l'importation : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Endpoint pour récupérer tous les barèmes
    @GetMapping("/all")
    public ResponseEntity<List<Bareme>> getAllBaremes() {
        List<Bareme> list = baremeService.getAllBaremes();
        return ResponseEntity.ok(list);
    }

    // Endpoint pour modifier un barème par ID
    @PutMapping("/modifier/{id}")
    public ResponseEntity<?> updateBareme(@PathVariable Long id, @RequestBody Bareme updatedBareme) {
        try {
            Bareme saved = baremeService.updateBareme(id, updatedBareme);
            return ResponseEntity.ok(Map.of("message", "Barème mis à jour avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Endpoint pour récupérer un barème par ID
    @GetMapping("/{id}")
    public ResponseEntity<Bareme> getBaremeById(@PathVariable Long id) {
        return baremeService.getBaremeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Endpoint pour supprimer un barème
    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<Map<String, String>> deleteBareme(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            baremeService.deleteBareme(id);
            response.put("message", "Barème supprimé avec succès !");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Erreur lors de la suppression : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
