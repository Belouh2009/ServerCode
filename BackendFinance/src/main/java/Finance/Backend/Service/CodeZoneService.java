package Finance.Backend.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Model.CodeZone;
import Finance.Backend.Repository.CodeZoneRepository;

@Service
public class CodeZoneService {

    @Autowired
    private CodeZoneRepository zoneRepository;

    // Sauvegarder une liste de zones sans supprimer les existantes
    public void saveZones(List<CodeZone> zoneList) {
        for (CodeZone zone : zoneList) {
            // Vérification minimale pour éviter les données nulles
            if (zone.getDistrict() == null) zone.setDistrict("Inconnu");
            if (zone.getZone() == null) zone.setZone("Zone par défaut");
            if (zone.getLocalite() == null) zone.setLocalite("Localité inconnue");
            if (zone.getCode_district() == null) zone.setCode_district(0);
            if (zone.getCode_localite() == null) zone.setCode_localite(0);
        }
        zoneRepository.saveAll(zoneList);
    }

    // Récupérer toutes les zones
    public List<CodeZone> getAllZones() {
        return zoneRepository.findAll();
    }

    // Mettre à jour une zone existante
    public CodeZone updateZone(Long id, CodeZone updatedZone) throws Exception {
        Optional<CodeZone> existingZoneOpt = zoneRepository.findById(id);

        if (!existingZoneOpt.isPresent()) {
            throw new Exception("Zone avec l'ID " + id + " non trouvée");
        }

        CodeZone zoneToUpdate = existingZoneOpt.get();
        zoneToUpdate.setDistrict(updatedZone.getDistrict());
        zoneToUpdate.setCode_district(updatedZone.getCode_district());
        zoneToUpdate.setCode_localite(updatedZone.getCode_localite());
        zoneToUpdate.setLocalite(updatedZone.getLocalite());
        zoneToUpdate.setZone(updatedZone.getZone());

        return zoneRepository.save(zoneToUpdate);
    }
}
