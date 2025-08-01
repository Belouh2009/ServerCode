package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "chapitre")
public class Chapitre {

    @Id
    private String code;

    public Chapitre() {}

    public Chapitre(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
