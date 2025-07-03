package Finance.Backend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.CodeCorps;
import Finance.Backend.Repository.CodeCorpsRepository;

@Service
public class CodeCorpsService {

	 @Autowired
	    private CodeCorpsRepository corpsRepository;

	    // Méthode pour sauvegarder une liste de Corps
	    public void saveCorps(List<CodeCorps> corpsList) {
	        for (CodeCorps corps : corpsList) {
	            if (corps.getIdCorps() == null || corps.getIdCorps().isEmpty()) {
	                // Générer un ID unique et le tronquer si nécessaire
	                String uniqueId = generateUniqueId();
	                if (uniqueId.length() > 15) {
	                    uniqueId = uniqueId.substring(0, 15);  // Tronquer à 15 caractères si nécessaire
	                }
	                corps.setIdCorps(uniqueId);  // Assigner l'ID unique
	            }
	        }
	        corpsRepository.saveAll(corpsList);  // Sauvegarder les entités Corps dans la base
	    }

	    // Méthode d'exemple pour générer un ID unique
	    private String generateUniqueId() {
	        return "COR_" + System.currentTimeMillis();  // Exemple de génération d'ID basé sur l'heure actuelle
	    }

	    // Méthode pour récupérer tous les corps depuis la base de données
	    public List<CodeCorps> getAllCorps() {
	        return corpsRepository.findAll();
	    }

	    // Méthode pour mettre à jour un Corps existant
	    public CodeCorps updateCorps(String id, CodeCorps corps) throws Exception {
	        Optional<CodeCorps> existingCorps = corpsRepository.findById(id);

	        if (!existingCorps.isPresent()) {
	            throw new Exception("Corps avec l'ID " + id + " non trouvé");
	        }

	        CodeCorps corpsToUpdate = existingCorps.get();
	        corpsToUpdate.setLibelleCorps(corps.getLibelleCorps());  // Mettre à jour le libellé du corps
	        corpsToUpdate.setCategorie(corps.getCategorie());        // Mettre à jour la catégorie du corps

	        return corpsRepository.save(corpsToUpdate);
	    }
	    

	    public String getLibelleCorps(String idCorps) {
	        Optional<CodeCorps> corps = corpsRepository.findById(idCorps);
	        return corps.map(CodeCorps::getLibelleCorps).orElse("ID Corps non trouvé");
	    }
}
