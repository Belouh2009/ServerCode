package Finance.Backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.Chapitre;
import Finance.Backend.Repository.ChapitreRepository;

@Service
public class ChapitreService {

    @Autowired
    private ChapitreRepository chapitreRepository;

    public List<Chapitre> getAllChapitres() {
        return chapitreRepository.findAll();
    }
}
