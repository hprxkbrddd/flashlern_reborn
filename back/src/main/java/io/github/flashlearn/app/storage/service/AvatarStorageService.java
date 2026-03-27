package io.github.flashlearn.app.storage.service;

import io.github.flashlearn.app.auth.security.SecurityUtils;
import io.github.flashlearn.app.profile.exception.AvatarUploadException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvatarStorageService {

    private final S3Client s3Client;

    @Value("${supabase.s3.avatars-bucket}")
    private String avatarsBucket;

    public String uploadAvatar(MultipartFile file) {
        String key = "avatars/" + SecurityUtils.getCurrentUserId() + "/" + UUID.randomUUID() + ".jpg";

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(avatarsBucket)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );
        } catch (IOException e) {
            throw new AvatarUploadException("Failed to upload avatar for user: " + SecurityUtils.getCurrentUsername());
        }

        return key;
    }

}
