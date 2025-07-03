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

import Finance.Backend.Model.CodeCorps;
import Finance.Backend.Service.CodeCorpsService;

@RestController
@RequestMapping("/corps")
@CrossOrigin("*")
public class CodeCorpsController {

    @Autowired
    private CodeCorpsService corpsService;

    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importCorps(@RequestBody List<CodeCorps> corpsList) {
        Map<String, String> response = new HashMap<>();
        try {
            // Sauvegarder la liste des Corps
            corpsService.saveCorps(corpsList);
            response.put("message", "Les données ont été importées avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("message", "Erreur lors de l'importation des données");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Endpoint pour récupérer tous les corps enregistrés
    @GetMapping("/all")
    public ResponseEntity<List<CodeCorps>> getAllCorps() {
        List<CodeCorps> corpsList = corpsService.getAllCorps();
        return ResponseEntity.ok(corpsList);
    }

    
    // Endpoint pour modifier un corps existant
    @PutMapping("/modifier/{id}")
    public ResponseEntity<Map<String, String>> modifierCorps(@PathVariable("id") String id, @RequestBody CodeCorps corps) {
        try {
            CodeCorps updatedCorps = corpsService.updateCorps(id, corps);  // Mettre à jour le corps
            Map<String, String> response = new HashMap<>();
            response.put("message", "Code Corps mis à jour avec succès !");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();  // Affiche l'erreur dans la console pour le debug
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors de la mise à jour du corps : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @GetMapping("/libelle/{idCorps}")
    public ResponseEntity<String> getLibelle(@PathVariable String idCorps) {
        String libelle = corpsService.getLibelleCorps(idCorps);
        return ResponseEntity.ok(libelle);
    }
}
