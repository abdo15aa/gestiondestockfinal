package com.stockflow.backend.controller;
import com.stockflow.backend.model.Article;
import com.stockflow.backend.model.Fournisseur;
import com.stockflow.backend.model.Mouvement;
import com.stockflow.backend.model.Notification;
import com.stockflow.backend.repository.ArticleRepository;
import com.stockflow.backend.repository.FournisseurRepository;
import com.stockflow.backend.repository.MouvementRepository;
import com.stockflow.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@RestController 
@RequestMapping("/api")


public class ApiController {

    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private MouvementRepository mouvementRepository;
    @Autowired
    private FournisseurRepository fournisseurRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @GetMapping("/articles")
    public List<Article> getArticles() {
        return articleRepository.findAll();
    }
    @PostMapping("/articles")
    public Article addArticle(@RequestBody Article article) {
        if(article.getStock() <= article.getSeuil()) {
            article.setStatut(Article.StockStatus.RUPTURE);
        } else {
            article.setStatut(Article.StockStatus.EN_STOCK);
        }
        return articleRepository.save(article);
    }
    @DeleteMapping("/articles/{ref}")
    @Transactional
    public void deleteArticle(@PathVariable String ref) {
        articleRepository.findById(ref).ifPresent(a -> {
            mouvementRepository.deleteByArticle(a.getRef());
            articleRepository.delete(a);
        });
    }
    @GetMapping("/mouvements")
    public List<Mouvement> getMouvements() {
        return mouvementRepository.findAll();
    }
    @PostMapping("/mouvements")
public Mouvement addMouvement(@RequestBody Mouvement mouvement) {

    if (mouvement.getId() == null || mouvement.getId().isEmpty()) {
        mouvement.setId("MVT-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
    }

    articleRepository.findById(mouvement.getArticle()).ifPresent(article -> {

        if (mouvement.getType() == Mouvement.MovementType.ENTREE) {

            article.setStock(article.getStock() + mouvement.getQuantite());

        } else if (mouvement.getType() == Mouvement.MovementType.SORTIE) {

            if (article.getStock() < mouvement.getQuantite()) {
                throw new RuntimeException("Stock insuffisant");
                exit 0;
            }

            article.setStock(article.getStock() - mouvement.getQuantite());
        }

        if (article.getStock() <= article.getSeuil()) {
            article.setStatut(Article.StockStatus.RUPTURE);
        } else {
            article.setStatut(Article.StockStatus.EN_STOCK);
        }

        articleRepository.save(article);
    });

    return mouvementRepository.save(mouvement);
}
    @GetMapping("/fournisseurs")
    public List<Fournisseur> getFournisseurs() {
        return fournisseurRepository.findAll();
    }
    @PostMapping("/fournisseurs")
    public Fournisseur addFournisseur(@RequestBody Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }
    @DeleteMapping("/fournisseurs/{id}")
    @Transactional
    public void deleteFournisseur(@PathVariable Long id) {
        fournisseurRepository.findById(id).ifPresent(f -> {
            List<Article> articles = articleRepository.findByFournisseur(f.getNom());
            for (Article a : articles) {
                mouvementRepository.deleteByArticle(a.getRef());
                articleRepository.delete(a);
            }
            fournisseurRepository.delete(f);
        });
    }
    @GetMapping("/notifications")
    public List<Notification> getNotifications() {
        return notificationRepository.findAll();
    }
}
