package io.github.flashlearn.app.profile.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AvatarUrlService {

    @Value("${supabase.project-id}")
    private String projectId;

    @Value("${supabase.s3.avatars-bucket}")
    private String avatarBucket;

    public String buildPublicAvatarUrl(String avatarKey) {
        if (avatarKey == null || avatarKey.isBlank()) {
            return null;
        }

        return "https://" + projectId +
                ".supabase.co/storage/v1/object/public/" +
                avatarBucket + "/" + avatarKey;
    }
}
