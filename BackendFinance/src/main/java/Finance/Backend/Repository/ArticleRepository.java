package Finance.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Finance.Backend.Model.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {

}
