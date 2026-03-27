package io.github.flashlearn.app.storage.service;

import io.github.flashlearn.app.storage.dto.LandingPageImagesDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Строит публичные URL изображений лендинга из бакета Supabase Storage (landing-page).
 * Ожидаемые ключи файлов в бакете: hero.jpg, about.jpg, features.jpg, contact.jpg.
 */
@Service
public class LandingPageStorageService {

    public static final String KEY_HERO = "hero.jpg";
    public static final String KEY_ABOUT = "about.jpg";
    public static final String KEY_FEATURES = "features.jpg";
    public static final String KEY_CONTACT = "contact.jpg";

    @Value("${supabase.project-id}")
    private String projectId;

    @Value("${supabase.s3.landing-page-bucket}")
    private String landingPageBucket;

    /**
     * Публичный URL формата Supabase: https://&lt;projectId&gt;.supabase.co/storage/v1/object/public/&lt;bucket&gt;/&lt;key&gt;
     */
    public String buildPublicUrl(String imageKey) {
        if (imageKey == null || imageKey.isBlank()) {
            return null;
        }
        return "https://" + projectId
                + ".supabase.co/storage/v1/object/public/"
                + landingPageBucket + "/" + imageKey;
    }

    /**
     * Возвращает DTO с URL всех четырёх изображений для лендинга.
     */
    public LandingPageImagesDto getLandingPageImageUrls() {
        return new LandingPageImagesDto(
                buildPublicUrl(KEY_HERO),
                buildPublicUrl(KEY_ABOUT),
                buildPublicUrl(KEY_FEATURES),
                buildPublicUrl(KEY_CONTACT)
        );
    }
}
