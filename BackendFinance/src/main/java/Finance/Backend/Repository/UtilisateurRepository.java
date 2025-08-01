package Finance.Backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import Finance.Backend.Model.Utilisateurs;

public interface UtilisateurRepository extends JpaRepository<Utilisateurs, String> {

Optional<Utilisateurs>findByUsername(String username);
	
	Optional<Utilisateurs> findByMatricule(String matricule);  // Ajoutez cette méthode pour rechercher par matricule
	
	List<Utilisateurs> findByValide(boolean valide);
	
	long countByValide(boolean valide);  // Ajoutez cette méthode pour compter les utilisateurs non validés
}
