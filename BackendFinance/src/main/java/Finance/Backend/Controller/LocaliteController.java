package Finance.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import Finance.Backend.Service.LocaliteService;

@RestController
@RequestMapping("/localites")
@CrossOrigin("*")
public class LocaliteController {

    @Autowired
    private LocaliteService localiteService;

    @GetMapping("/noms")
    public List<String> getLocaliteNames() {
        return localiteService.getAllLocaliteNames();
    }
}
