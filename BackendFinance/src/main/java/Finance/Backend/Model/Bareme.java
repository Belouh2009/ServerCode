package Finance.Backend.Model;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;

@Entity
@Table(name = "bareme")
public class Bareme {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // si tu veux une clé primaire auto-incrémentée
  private Long id;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
  private LocalDate datebareme;

  private Integer categorie;

  private Integer indice;

  private BigDecimal v500;

  private BigDecimal v501;

  private BigDecimal v502;

  private BigDecimal v503;

  private BigDecimal v506;

  private BigDecimal solde;

  // --- Getters & Setters ---
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public LocalDate getDatebareme() {
    return datebareme;
  }

  public void setDatebareme(LocalDate datebareme) {
    this.datebareme = datebareme;
  }

  public Integer getCategorie() {
    return categorie;
  }

  public void setCategorie(Integer categorie) {
    this.categorie = categorie;
  }

  public Integer getIndice() {
    return indice;
  }

  public void setIndice(Integer indice) {
    this.indice = indice;
  }

  public BigDecimal getV500() {
    return v500;
  }

  public void setV500(BigDecimal v500) {
    this.v500 = v500;
  }

  public BigDecimal getV501() {
    return v501;
  }

  public void setV501(BigDecimal v501) {
    this.v501 = v501;
  }

  public BigDecimal getV502() {
    return v502;
  }

  public void setV502(BigDecimal v502) {
    this.v502 = v502;
  }

  public BigDecimal getV503() {
    return v503;
  }

  public void setV503(BigDecimal v503) {
    this.v503 = v503;
  }

  public BigDecimal getV506() {
    return v506;
  }

  public void setV506(BigDecimal v506) {
    this.v506 = v506;
  }

  public BigDecimal getSolde() {
    return solde;
  }

  public void setSolde(BigDecimal solde) {
    this.solde = solde;
  }
}
