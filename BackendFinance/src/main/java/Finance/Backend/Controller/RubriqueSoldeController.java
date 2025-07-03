package Finance.Backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Finance.Backend.Model.RubriqueSolde;
import Finance.Backend.Repository.RubriqueSoldeRepository;
import Finance.Backend.Service.RubriqueSoldeService;

@RestController
@RequestMapping("/rubriquesolde")
@CrossOrigin("*")
public class RubriqueSoldeController {

	@Autowired
    private RubriqueSoldeRepository rubriqueRepository;
    
    @Autowired
    private RubriqueSoldeService rubriqueService;

    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importRubriques(@RequestBody List<RubriqueSolde> rubriques) {
        Map<String, String> response = new HashMap<>();
        try {
            rubriqueService.saveRubriques(rubriques);  // Sauvegarder les rubriques
            response.put("message", "Les données ont été importées avec succès!!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Erreur lors de l'importation des données");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    @GetMapping("/ids")
    public ResponseEntity<List<String>> getAllRubriqueIds() {
        List<String> ids = rubriqueRepository.findAllRubriqueIds();
        return ResponseEntity.ok(ids);
    }
    
    
    // Endpoint pour récupérer la liste des rubriques
    @GetMapping("/liste")
    public List<RubriqueSolde> getAllRubriques() {
        return rubriqueService.getAllRubriques();
    }
    
    
    @PutMapping("/modifier/{id}")
    public ResponseEntity<Map<String, String>> modifierRubrique(@PathVariable("id") String id, @RequestBody RubriqueSolde rubrique) {

        try {
            RubriqueSolde updatedRubrique = rubriqueService.updateRubrique(id, rubrique);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Rubrique mise à jour avec succès !");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();  // Affiche l'erreur dans la console
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors de la mise à jour de la rubrique : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
