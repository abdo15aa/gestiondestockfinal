package com.stockflow.backend.service;

import com.stockflow.backend.model.Article;
import com.stockflow.backend.model.Fournisseur;
import com.stockflow.backend.model.Mouvement;
import com.stockflow.backend.model.Notification;
import com.stockflow.backend.repository.ArticleRepository;
import com.stockflow.backend.repository.FournisseurRepository;
import com.stockflow.backend.repository.MouvementRepository;
import com.stockflow.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private FournisseurRepository fournisseurRepository;
    @Autowired
    private MouvementRepository mouvementRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public void run(String... args) throws Exception {
        if (articleRepository.count() == 0) {
            // Seed Fournisseurs
            Fournisseur f1 = new Fournisseur(); f1.setNom("Boulonnerie Lefranc"); f1.setContact("lefranc@boulonnerie.fr"); f1.setArticles("Visserie, Boulonnerie");
            Fournisseur f2 = new Fournisseur(); f2.setNom("Métaux Guilbert"); f2.setContact("commandes@guilbert-metaux.com"); f2.setArticles("Profilés, Tubes, Tôles");
            fournisseurRepository.saveAll(Arrays.asList(f1, f2));

            // Seed Articles
            Article a1 = new Article(); a1.setRef("VIS-M6-12"); a1.setDesignation("Vis M6x12 inox"); a1.setCategorie("Visserie"); a1.setStock(8420); a1.setSeuil(1000); a1.setFournisseur("Boulonnerie Lefranc"); a1.setStatut(Article.StockStatus.EN_STOCK);
            Article a2 = new Article(); a2.setRef("ROD-ALU-40"); a2.setDesignation("Tige filetée alu Ø40"); a2.setCategorie("Profilés"); a2.setStock(145); a2.setSeuil(200); a2.setFournisseur("Métaux Guilbert"); a2.setStatut(Article.StockStatus.STOCK_BAS);
            articleRepository.saveAll(Arrays.asList(a1, a2));

            // Seed Mouvements
            Mouvement m1 = new Mouvement(); m1.setId("MVT-2458"); m1.setDate("25 mai 2025"); m1.setArticle("Vis M6x12 inox"); m1.setType(Mouvement.MovementType.ENTREE); m1.setQuantite(500); m1.setOperateur("Jean Dupont");
            Mouvement m2 = new Mouvement(); m2.setId("MVT-2457"); m2.setDate("25 mai 2025"); m2.setArticle("Tige filetée alu Ø40"); m2.setType(Mouvement.MovementType.SORTIE); m2.setQuantite(50); m2.setOperateur("Marie Curie");
            mouvementRepository.saveAll(Arrays.asList(m1, m2));

            // Seed Notifications
            Notification n1 = new Notification(); n1.setId("N1"); n1.setSeverity("critical"); n1.setTitle("Stock sous le seuil minimum"); n1.setDescription("Tige filetée alu Ø40"); n1.setTimestamp("Il y a 2h"); n1.setUnread(true);
            notificationRepository.save(n1);
        }
    }
}
