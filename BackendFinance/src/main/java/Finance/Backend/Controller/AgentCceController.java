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

import Finance.Backend.DTO.AgentCceDTO;
import Finance.Backend.Exception.ApiResponse;
import Finance.Backend.Service.AgentCceService;

@RestController
@RequestMapping("/agentsCce")
@CrossOrigin("*")
public class AgentCceController {

	private final AgentCceService agentService;

    public AgentCceController(AgentCceService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/enregistre")
    public ResponseEntity<String> ajouterAgent(@RequestBody AgentCceDTO agentDTO) {
        agentService.enregistrerAgent(agentDTO);
        return new ResponseEntity<>("Agent enregistré avec succès.", HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public AgentCceDTO getAgent(@PathVariable Long id) {
        return agentService.getAgentWithSesituer(id);
    }
    
 // Endpoint pour récupérer tous les agents avec leurs informations dans SeSituer
    @GetMapping("/all")
    public List<AgentCceDTO> getAllAgentsWithSesituer() {
        return agentService.getAllAgentsWithSesituer();
    }
    
    
    // Si tu veux utiliser PUT pour mettre à jour un agent
    @PutMapping("/modifier/{idAgent}")
    public ResponseEntity<Object> saveOrUpdateAgent(@PathVariable Long idAgent, @RequestBody AgentCceDTO agentDTO) {
        try {
            // Assigner l'ID à l'objet DTO
            agentDTO.setIdAgent(idAgent);
            
            // Enregistrer ou mettre à jour l'agent
            AgentCceDTO savedAgentDTO = agentService.saveOrUpdateAgent(agentDTO);
            
            // Retourner une réponse avec un message de confirmation
            return ResponseEntity.ok(new ApiResponse("Modification réussie", savedAgentDTO));
            
        } catch (RuntimeException e) {
            // Gérer l'exception (par exemple, agent non trouvé)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Agent non trouvé avec l'ID " + idAgent, null));
        }
    }
}