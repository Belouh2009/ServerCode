package Finance.Backend.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Finance.Backend.DTO.AgentCcpsRectDTO;
import Finance.Backend.Exception.ApiResponse;
import Finance.Backend.Service.AgentCcpsRectService;

@RestController
@RequestMapping("/agentsCcpsRect")
@CrossOrigin("*")
public class AgentCcpsRectController {

	private final AgentCcpsRectService agentService;

    public AgentCcpsRectController(AgentCcpsRectService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/enregistre")
    public ResponseEntity<String> ajouterAgent(@RequestBody AgentCcpsRectDTO agentDTO) {
        agentService.enregistrerAgent(agentDTO);
        return new ResponseEntity<>("Agent enregistré avec succès.", HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public AgentCcpsRectDTO getAgent(@PathVariable String id) {
        return agentService.getAgentWithSesituer(id);
    }
    
 // Endpoint pour récupérer tous les agents avec leurs informations dans SeSituer
    @GetMapping("/all")
    public List<AgentCcpsRectDTO> getAllAgentsWithSesituer() {
        return agentService.getAllAgentsWithSesituer();
    }
    
    
    // Si tu veux utiliser PUT pour mettre à jour un agent
    @PutMapping("/modifier/{matricule}")
    public ResponseEntity<Object> saveOrUpdateAgent(@PathVariable String matricule, @RequestBody AgentCcpsRectDTO agentDTO) {
        try {
            // Assigner l'ID à l'objet DTO
            agentDTO.setMatricule(matricule);
            
            // Enregistrer ou mettre à jour l'agent
            AgentCcpsRectDTO savedAgentDTO = agentService.saveOrUpdateAgent(agentDTO);
            
            // Retourner une réponse avec un message de confirmation
            return ResponseEntity.ok(new ApiResponse("Modification réussie", savedAgentDTO));
            
        } catch (RuntimeException e) {
            // Gérer l'exception (par exemple, agent non trouvé)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Agent non trouvé avec l'ID " + matricule, null));
        }
    }
}
