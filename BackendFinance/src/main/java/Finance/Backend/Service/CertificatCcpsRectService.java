package Finance.Backend.Service;

import java.text.DecimalFormat;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Finance.Backend.Repository.CertificatCcpsRectRepository;

@Service
public class CertificatCcpsRectService {

	@Autowired
    private CertificatCcpsRectRepository certificatCcpsRepository;

    public String generateCertificatId() {
        // Récupérer l'année actuelle
        int currentYear = Calendar.getInstance().get(Calendar.YEAR);

        // Récupérer le dernier ID de certificat dans la base de données
        String lastCertificatId = getLastCertificatId(); 

        // Si aucun certificat n'existe, commencer avec '0001-2025'
        if (lastCertificatId == null) {
            return formatCertificatId(1, currentYear);
        } else {
            // Extraire le numéro séquentiel de l'ID (ex: '0001' dans '0001-2025')
            int lastNumber = Integer.parseInt(lastCertificatId.split("-")[0]);
            return formatCertificatId(lastNumber + 1, currentYear);
        }
    }

    private String getLastCertificatId() {
        // Cette méthode devrait interroger ta base de données pour récupérer l'ID du dernier certificat
        // Par exemple, vous pouvez faire une requête SQL pour récupérer le dernier certificat par ID
        // Cela suppose que vous avez une méthode qui récupère le dernier certificat de la base de données
        return null;  // Simulé : il n'y a pas encore de certificat dans la base de données
    }

    private String formatCertificatId(int number, int year) {
        // Formater le numéro pour qu'il ait toujours 4 chiffres (ex: '0001', '0002', etc.)
        DecimalFormat df = new DecimalFormat("0000");
        return df.format(number) + "-" + year;
    }
    
    
    public long countCertificats() {
        return certificatCcpsRepository.count();
    }
}
