package Finance.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.Model.SesituerCce;
import Finance.Backend.Service.SesituerCceService;

@RestController
@RequestMapping("/sesituerCce")
@CrossOrigin("*")
public class SesituerCceController {


    @Autowired
    private SesituerCceService sesituerCceService;

    // 🔍 Endpoint pour récupérer tous les enregistrements par id_agent
    @GetMapping("/agent/{idAgent}")
    public List<SesituerCce> getSesituerByAgentId(@PathVariable Long idAgent) {
        return sesituerCceService.getSesituerByAgentId(idAgent);
    }
}