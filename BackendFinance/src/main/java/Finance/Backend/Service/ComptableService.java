package Finance.Backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import Finance.Backend.Repository.ComptableRepository;

@Service
public class ComptableService {

  private final ComptableRepository repository;

  public ComptableService(ComptableRepository repository) {
    this.repository = repository;
  }

  public List<String> getAllNomComptable() {
    return repository.findAllNomComptable();
  }

}
