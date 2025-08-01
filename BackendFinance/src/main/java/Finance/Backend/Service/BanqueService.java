package Finance.Backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Repository.BanqueRepository;
import java.util.List;

@Service
public class BanqueService {
  @Autowired
  private BanqueRepository banqueRepository;

  public List<String> getAllNomBanque() {
    return banqueRepository.findAll()
        .stream()
        .map(b -> b.getNom_banque())
        .toList();
  }
}
