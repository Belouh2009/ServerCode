package Finance.Backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.SesituerCap;
import Finance.Backend.Repository.SeSituerCapRepository;

@Service
public class SesituerCapService {

	 @Autowired
	    private SeSituerCapRepository sesituerCapRepository;

	    public List<SesituerCap> getSesituerByAgentId(Long idAgent) {
	        return sesituerCapRepository.findByAgent_IdAgent(idAgent);
	    }
}
