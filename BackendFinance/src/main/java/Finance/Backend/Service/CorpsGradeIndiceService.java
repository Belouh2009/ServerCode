package Finance.Backend.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.CorpsGradeIndice;
import Finance.Backend.Repository.CorpsGradeIndiceRepository;

@Service
public class CorpsGradeIndiceService {

    @Autowired
    private CorpsGradeIndiceRepository corpsGradeIndiceRepository;

    public void saveCorpsGradeIndice(List<CorpsGradeIndice> corpsList) {
        // Créer un Set pour éliminer les doublons
        Set<String> seen = new HashSet<>();
        
        // Filtrer les doublons
        List<CorpsGradeIndice> filteredList = corpsList.stream()
            .filter(corps -> seen.add(corps.getCorps() + "-" + corps.getGrade() + "-" + corps.getIndice())) // La clé unique est composée de corps, grade et indice
            .collect(Collectors.toList());

        // Sauvegarder la liste sans doublons
        corpsGradeIndiceRepository.saveAll(filteredList);
    }

    public List<CorpsGradeIndice> getAllCorpsGradeIndice() {
        return corpsGradeIndiceRepository.findAll();
    }

    public CorpsGradeIndice updateCorpsGradeIndice(Long id, CorpsGradeIndice corps) throws Exception {
        Optional<CorpsGradeIndice> existingCorps = corpsGradeIndiceRepository.findById(id);

        if (!existingCorps.isPresent()) {
            throw new Exception("Corps Grade Indice avec l'ID " + id + " non trouvé");
        }

        CorpsGradeIndice corpsToUpdate = existingCorps.get();
        corpsToUpdate.setCorps(corps.getCorps());
        corpsToUpdate.setGrade(corps.getGrade());
        corpsToUpdate.setIndice(corps.getIndice());

        return corpsGradeIndiceRepository.save(corpsToUpdate);
    }
}
