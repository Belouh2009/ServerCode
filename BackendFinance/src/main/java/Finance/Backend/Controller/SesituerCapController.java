package Finance.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.Model.SesituerCap;
import Finance.Backend.Service.SesituerCapService;

@RestController
@RequestMapping("/sesituer")
@CrossOrigin("*")
public class SesituerCapController {

    @Autowired
    private SesituerCapService sesituerCapService;

    // 🔍 Endpoint pour récupérer tous les enregistrements par id_agent
    @GetMapping("/agent/{idAgent}")
    public List<SesituerCap> getSesituerByAgentId(@PathVariable Long idAgent) {
        return sesituerCapService.getSesituerByAgentId(idAgent);
    }
}
