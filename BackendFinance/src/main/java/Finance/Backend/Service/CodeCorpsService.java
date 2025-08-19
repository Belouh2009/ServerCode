package Finance.Backend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.CodeCorps;
import Finance.Backend.Repository.CodeCorpsRepository;

@Service
public class CodeCorpsService {

    @Autowired
    private CodeCorpsRepository corpsRepository;

    // Sauvegarder une liste de corps
    public void saveCorps(List<CodeCorps> corpsList) {
        for (CodeCorps corps : corpsList) {
            if (corps.getCorps() == null || corps.getCorps().trim().isEmpty()) {
                throw new IllegalArgumentException("Le champ 'corps' est obligatoire.");
            }
            if (corps.getGrade() == null || corps.getGrade().trim().isEmpty()) {
                throw new IllegalArgumentException("Le champ 'grade' est obligatoire.");
            }
        }

        try {
            corpsRepository.saveAll(corpsList);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Un enregistrement avec ce corps et ce grade existe déjà.", e);
        }
    }

    // Récupérer tous les corps
    public List<CodeCorps> getAllCorps() {
        return corpsRepository.findAll();
    }

    // Mettre à jour un corps existant
    public CodeCorps updateCorps(Long id, CodeCorps corps) throws Exception {
        Optional<CodeCorps> existingCorps = corpsRepository.findById(id);

        if (!existingCorps.isPresent()) {
            throw new Exception("Corps avec l'ID " + id + " non trouvé");
        }

        CodeCorps corpsToUpdate = existingCorps.get();
        corpsToUpdate.setCorps(corps.getCorps());
        corpsToUpdate.setLibelleCorps(corps.getLibelleCorps());
        corpsToUpdate.setCategorie(corps.getCategorie());
        corpsToUpdate.setGrade(corps.getGrade());
        corpsToUpdate.setIndice(corps.getIndice());

        return corpsRepository.save(corpsToUpdate);
    }

}
