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

    // Méthode pour sauvegarder une liste de Zones
    public void saveZones(List<CodeZone> zoneList) {
        for (CodeZone zone : zoneList) {
            if (zone.getId_zone() == null) {
                // Générer un ID unique pour la zone (auto-généré dans PostgreSQL)
                zone.setDistrict(zone.getDistrict() != null ? zone.getDistrict() : "Inconnu");
                zone.setZone0(zone.getZone0() != null ? zone.getZone0() : "Zone0 par défaut");
            }
        }
        zoneRepository.saveAll(zoneList);  // Sauvegarder la liste de zones dans la base
    }

    // Méthode pour récupérer toutes les zones depuis la base de données
    public List<CodeZone> getAllZones() {
        return zoneRepository.findAll();
    }

    // Méthode pour mettre à jour une zone existante
    public CodeZone updateZone(Long id, CodeZone zone) throws Exception {
        Optional<CodeZone> existingZone = zoneRepository.findById(id);

        if (!existingZone.isPresent()) {
            throw new Exception("Zone avec l'ID " + id + " non trouvée");
        }

        CodeZone zoneToUpdate = existingZone.get();
        zoneToUpdate.setDistrict(zone.getDistrict());   // Mettre à jour le district
        zoneToUpdate.setZone0(zone.getZone0());         // Mettre à jour zone0
        zoneToUpdate.setZone1(zone.getZone1());         // Mettre à jour zone1
        zoneToUpdate.setCodeZone1(zone.getCodeZone1()); // Mettre à jour le code zone1
        zoneToUpdate.setZone2(zone.getZone2());         // Mettre à jour zone2
        zoneToUpdate.setCodeZone2(zone.getCodeZone2()); // Mettre à jour le code zone2
        zoneToUpdate.setZone3(zone.getZone3());         // Mettre à jour zone3
        zoneToUpdate.setCodeZone3(zone.getCodeZone3()); // Mettre à jour le code zone3

        return zoneRepository.save(zoneToUpdate);       // Sauvegarder les modifications
    }
}
