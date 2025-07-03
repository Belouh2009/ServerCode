package Finance.Backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Repository.LocaliteRepository;

@Service
public class LocaliteService {

    @Autowired
    private LocaliteRepository localiteRepository;

    public List<String> getAllLocaliteNames() {
        return localiteRepository.findAllLocaliteNames();
    }
}
