package Finance.Backend.Controller;

import java.util.List;

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

import Finance.Backend.DTO.AgentCcpsDTO;
import Finance.Backend.Exception.ApiResponse;
import Finance.Backend.Service.AgentCcpsService;

@RestController
@RequestMapping("/agentsCcps")
@CrossOrigin("*")
public class AgentCcpsController {

	private final AgentCcpsService agentService;

    public AgentCcpsController(AgentCcpsService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/enregistre")
    public ResponseEntity<String> ajouterAgent(@RequestBody AgentCcpsDTO agentDTO) {
        agentService.enregistrerAgent(agentDTO);
        return new ResponseEntity<>("Agent enregistré avec succès.", HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public AgentCcpsDTO getAgent(@PathVariable String id) {
        return agentService.getAgentWithSesituer(id);
    }
    
 // Endpoint pour récupérer tous les agents avec leurs informations dans SeSituer
    @GetMapping("/all")
    public List<AgentCcpsDTO> getAllAgentsWithSesituer() {
        return agentService.getAllAgentsWithSesituer();
    }
    
    
    // Si tu veux utiliser PUT pour mettre à jour un agent
    @PutMapping("/modifier/{matricule}")
    public ResponseEntity<Object> saveOrUpdateAgent(@PathVariable String matricule, @RequestBody AgentCcpsDTO agentDTO) {
        try {
            // Assigner l'ID à l'objet DTO
            agentDTO.setMatricule(matricule);
            
            // Enregistrer ou mettre à jour l'agent
            AgentCcpsDTO savedAgentDTO = agentService.saveOrUpdateAgent(agentDTO);
            
            // Retourner une réponse avec un message de confirmation
            return ResponseEntity.ok(new ApiResponse("Modification réussie", savedAgentDTO));
            
        } catch (RuntimeException e) {
            // Gérer l'exception (par exemple, agent non trouvé)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Agent non trouvé avec l'ID " + matricule, null));
        }
    }
}
