package Finance.Backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import Finance.Backend.Model.Article;
import Finance.Backend.Service.ArticleService;

@RestController
@RequestMapping("/articles")
@CrossOrigin("*")
public class ArticleController {


    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }
}
