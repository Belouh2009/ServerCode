package Finance.Backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import Finance.Backend.Model.Article;
import Finance.Backend.Repository.ArticleRepository;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }
}
