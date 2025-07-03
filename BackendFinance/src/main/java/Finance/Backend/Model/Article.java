package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "Article")
public class Article {

    @Id
    private String idArticle;

    public String getIdArticle() {
        return idArticle;
    }

    public void setIdArticle(String idArticle) {
        this.idArticle = idArticle;
    }
}
