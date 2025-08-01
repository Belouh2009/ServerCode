package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "comptable")
public class Comptable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id_comptable;

  @Column(name = "nom_comptable", nullable = false, unique = true)
  private String nom_comptable;

  public Long getId_comptable() {
    return id_comptable;
  }

  public void setId_comptable(Long id_comptable) {
    this.id_comptable = id_comptable;
  }

  public String getNom_comptable() {
    return nom_comptable;
  }

  public void setNom_comptable(String nom_comptable) {
    this.nom_comptable = nom_comptable;
  }

  public Comptable(Long id_comptable, String nom_comptable) {
    this.id_comptable = id_comptable;
    this.nom_comptable = nom_comptable;
  }

}
