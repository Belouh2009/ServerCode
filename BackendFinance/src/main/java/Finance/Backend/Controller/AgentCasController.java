package Finance.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Finance.Backend.DTO.AgentCasDTO;
import Finance.Backend.Model.AgentCas;
import Finance.Backend.Service.AgentCasService;

@RestController
@RequestMapping("/agentsCas")
@CrossOrigin("*")
public class AgentCasController {

    @Autowired
    private AgentCasService agentCasService;

    // Endpoint pour enregistrer un agent à partir d'un DTO
    @PostMapping("/enregistre")
    public AgentCas enregistrerAgent(@RequestBody AgentCasDTO agentDTO) {
        return agentCasService.enregistrerAgent(agentDTO);  // Utilisation de la méthode correcte
    }

    // Endpoint pour modifier un agent par matricule à partir d'un DTO
    @PutMapping("/modifier/{matricule}")
    public AgentCasDTO updateAgent(@PathVariable String matricule, @RequestBody AgentCasDTO agentDTO) {
        return agentCasService.saveOrUpdateAgent(matricule, agentDTO);
    }


    // Endpoint pour lister tous les agents
    @GetMapping("/all")
    public List<AgentCas> listAllAgents() {
        return agentCasService.getAllAgents();
    }
}
