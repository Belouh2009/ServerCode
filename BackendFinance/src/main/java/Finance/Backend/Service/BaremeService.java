package Finance.Backend.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.Bareme;
import Finance.Backend.Repository.BaremeRepository;

@Service
public class BaremeService {
    @Autowired
    private BaremeRepository baremeRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public List<String> getDistinctDatesFormatted() {
        return baremeRepository.findDistinctDatebareme().stream()
                .map(date -> date.format(dateFormatter))
                .collect(Collectors.toList());
    }

    public List<Integer> getCategoriesForDate(String formattedDate) {
        LocalDate date = LocalDate.parse(formattedDate, dateFormatter);
        return baremeRepository.findDistinctCategorieByDatebareme(date);
    }

    public List<Integer> getIndicesForDateAndCategory(String formattedDate, Integer category) {
        LocalDate date = LocalDate.parse(formattedDate, dateFormatter);
        return baremeRepository.findDistinctIndiceByDatebaremeAndCategorie(date, category);
    }

    // Sauvegarder une liste de barèmes
    public void saveAllBaremes(List<Bareme> baremeList) {
        for (Bareme b : baremeList) {
            boolean exists = baremeRepository.existsByDatebaremeAndCategorieAndIndice(
                    b.getDatebareme(), b.getCategorie(), b.getIndice());

            if (!exists) {
                baremeRepository.save(b);
            }
        }
    }

    // Sauvegarder un seul barème
    public Bareme saveBareme(Bareme bareme) {
        return baremeRepository.save(bareme);
    }

    // Récupérer tous les barèmes
    public List<Bareme> getAllBaremes() {
        return baremeRepository.findAll();
    }

    // Récupérer un barème par ID (Long id, si tu as un champ ID auto-généré)
    public Optional<Bareme> getBaremeById(Long id) {
        return baremeRepository.findById(id);
    }

    // Mise à jour d'un barème
    public Bareme updateBareme(Long id, Bareme newData) throws Exception {
        Bareme existing = baremeRepository.findById(id)
                .orElseThrow(() -> new Exception("Barème non trouvé"));

        existing.setDatebareme(newData.getDatebareme());
        existing.setCategorie(newData.getCategorie());
        existing.setIndice(newData.getIndice());
        existing.setV500(newData.getV500());
        existing.setV501(newData.getV501());
        existing.setV502(newData.getV502());
        existing.setV503(newData.getV503());
        existing.setV506(newData.getV506());
        existing.setSolde(newData.getSolde());

        return baremeRepository.save(existing);
    }

    // Supprimer un barème
    public void deleteBareme(Long id) {
        baremeRepository.deleteById(id);
    }
}
