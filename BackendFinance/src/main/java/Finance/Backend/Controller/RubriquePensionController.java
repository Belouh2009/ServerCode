package Finance.Backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.Model.RubriquePension;
import Finance.Backend.Repository.RubriquePensionRepository;
import Finance.Backend.Service.RubriquePensionService;

@RestController
@RequestMapping("/rubriques")
@CrossOrigin("*")
public class RubriquePensionController {

    @Autowired
    private RubriquePensionRepository rubriqueRepository;
    
    @Autowired
    private RubriquePensionService rubriqueService;

    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importRubriques(@RequestBody List<RubriquePension> rubriques) {
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
    public List<RubriquePension> getAllRubriques() {
        return rubriqueService.getAllRubriques();
    }
    
    
    @PutMapping("/modifier/{id}")
    public ResponseEntity<Map<String, String>> modifierRubrique(@PathVariable("id") String id, @RequestBody RubriquePension rubrique) {

        try {
            RubriquePension updatedRubrique = rubriqueService.updateRubrique(id, rubrique);
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
