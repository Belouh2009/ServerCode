package Finance.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import Finance.Backend.Service.ChapitreService;

@RestController
@RequestMapping("/chapitres")
@CrossOrigin("*") 
public class ChapitreController {

    @Autowired
    private ChapitreService chapitreService;

    @GetMapping
    public List<String> getChapitresFormatted() {
        return chapitreService.getAllChapitres()
                              .stream()
                              .map(chapitre -> chapitre.getCode().substring(2, 5)) // Extraire les 3 chiffres après "00"
                              .toList();
    }
}
