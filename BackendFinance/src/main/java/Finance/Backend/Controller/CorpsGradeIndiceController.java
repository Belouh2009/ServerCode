package Finance.Backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.Model.CorpsGradeIndice;
import Finance.Backend.Repository.CorpsGradeIndiceRepository;
import Finance.Backend.Service.CorpsGradeIndiceService;

@RestController
@RequestMapping("/CorpsGradeIndice")
@CrossOrigin("*")
public class CorpsGradeIndiceController {

    @Autowired
    private CorpsGradeIndiceService corpsGradeIndiceService;

    @Autowired
    private CorpsGradeIndiceRepository corpsGradeIndiceRepository;

    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importCorpsGradeIndice(@RequestBody List<CorpsGradeIndice> corpsList) {
        Map<String, String> response = new HashMap<>();
        try {
            corpsGradeIndiceService.saveCorpsGradeIndice(corpsList);
            response.put("message", "Les données Corps Grade Indice ont été importées avec succès !");
            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            response.put("message", "Erreur : Une ou plusieurs valeurs de 'corps' existent déjà.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            response.put("message", "Erreur lors de l'importation des données");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CorpsGradeIndice>> getAllCorpsGradeIndice() {
        List<CorpsGradeIndice> corpsList = corpsGradeIndiceService.getAllCorpsGradeIndice();
        return ResponseEntity.ok(corpsList);
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<Map<String, String>> modifierCorpsGradeIndice(@PathVariable("id") Long id,
            @RequestBody CorpsGradeIndice corps) {
        try {
            CorpsGradeIndice updatedCorps = corpsGradeIndiceService.updateCorpsGradeIndice(id, corps);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Corps Grade Indice mis à jour avec succès !");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors de la mise à jour du Corps Grade Indice : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/corps")
    public List<String> getAllCorps() {
        // Récupère distinctement les valeurs de la colonne "corps"
        return corpsGradeIndiceRepository.findDistinctCorps();
    }

    @GetMapping("/grades")
    public List<Map<String, Object>> getGradesWithIndices(@RequestParam String corps) {
        return corpsGradeIndiceRepository.findGradesWithIndices(corps);
    }

}
