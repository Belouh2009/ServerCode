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

import Finance.Backend.Model.CodeZone;
import Finance.Backend.Service.CodeZoneService;

@RestController
@RequestMapping("/zones")
@CrossOrigin("*")
public class CodeZoneController {

	@Autowired
    private CodeZoneService zoneService;

    // Endpoint pour importer une liste de zones
    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importZones(@RequestBody List<CodeZone> zoneList) {
        Map<String, String> response = new HashMap<>();
        try {
            // Sauvegarder la liste des zones
            zoneService.saveZones(zoneList);
            response.put("message", "Les zones ont été importées avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("message", "Erreur lors de l'importation des zones");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Endpoint pour récupérer toutes les zones enregistrées
    @GetMapping("/all")
    public ResponseEntity<List<CodeZone>> getAllZones() {
        List<CodeZone> zoneList = zoneService.getAllZones();
        return ResponseEntity.ok(zoneList);
    }
    
    // Endpoint pour modifier une zone existante
    @PutMapping("/modifier/{id}")
    public ResponseEntity<Map<String, String>> modifierZone(@PathVariable("id") Long id, @RequestBody CodeZone zone) {
        try {
            zoneService.updateZone(id, zone);  // Mettre à jour la zone
            Map<String, String> response = new HashMap<>();
            response.put("message", "Zone mise à jour avec succès !");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();  // Affiche l'erreur dans la console pour le debug
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors de la mise à jour de la zone : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
