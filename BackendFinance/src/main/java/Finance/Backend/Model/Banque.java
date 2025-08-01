package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "banque")
public class Banque {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id_banque;

  @Column(name = "nom_banque", nullable = false, unique = true)
  private String nom_banque;

  // Getters et Setters
  public Long getId_banque() {
    return id_banque;
  }

  public void setId_banque(Long id_banque) {
    this.id_banque = id_banque;
  }

  public String getNom_banque() {
    return nom_banque;
  }

  public void setNom_banque(String nom_banque) {
    this.nom_banque = nom_banque;
  }
}
