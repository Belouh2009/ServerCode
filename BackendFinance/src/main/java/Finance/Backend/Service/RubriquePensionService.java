package Finance.Backend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.RubriquePension;
import Finance.Backend.Repository.RubriquePensionRepository;

@Service
public class RubriquePensionService {

    @Autowired
    private RubriquePensionRepository rubriqueRepository;

    public void saveRubriques(List<RubriquePension> rubriques) {
        for (RubriquePension rubrique : rubriques) {
            if (rubrique.getIdRubrique() == null || rubrique.getIdRubrique().isEmpty()) {
                // Générer un ID unique et le tronquer si nécessaire
                String uniqueId = generateUniqueId();
                if (uniqueId.length() > 15) {
                    uniqueId = uniqueId.substring(0, 15);  // Tronquer à 15 caractères si nécessaire
                }
                rubrique.setIdRubrique(uniqueId);  // Assigner l'ID unique
            }
        }
        rubriqueRepository.saveAll(rubriques);  // Sauvegarder les rubriques dans la base
    }

    // Méthode d'exemple pour générer un ID unique
    private String generateUniqueId() {
        return "RUB_" + System.currentTimeMillis();  // Exemple de génération d'ID basé sur l'heure actuelle
    }
    
    
    // Méthode pour récupérer toutes les rubriques depuis la base de données
    public List<RubriquePension> getAllRubriques() {
        return rubriqueRepository.findAll();
    }
    
    
    public RubriquePension updateRubrique(String id, RubriquePension rubrique) throws Exception {
        Optional<RubriquePension> existingRubrique = rubriqueRepository.findById(id);
        
        if (!existingRubrique.isPresent()) {
            throw new Exception("Rubrique avec l'ID " + id + " non trouvée");
        }

        RubriquePension rubriqueToUpdate = existingRubrique.get();
        rubriqueToUpdate.setLibelle(rubrique.getLibelle());  // Exemple de mise à jour
        return rubriqueRepository.save(rubriqueToUpdate);
    }

}
