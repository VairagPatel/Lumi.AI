package in.LumiAI.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    private Cloudinary getCloudinary() {
        if (cloudinary == null) {
            cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
            ));
        }
        return cloudinary;
    }

    public Map<String, Object> uploadImage(byte[] imageBytes, String folder) throws IOException {
        log.info("Uploading image to Cloudinary folder: {}", folder);
        
        Map<String, Object> uploadResult = getCloudinary().uploader().upload(imageBytes, ObjectUtils.asMap(
            "folder", folder,
            "resource_type", "image",
            "format", "png"
        ));

        log.info("Image uploaded successfully. Public ID: {}", uploadResult.get("public_id"));
        return uploadResult;
    }

    public void deleteImage(String publicId) throws IOException {
        log.info("Deleting image from Cloudinary: {}", publicId);
        getCloudinary().uploader().destroy(publicId, ObjectUtils.emptyMap());
        log.info("Image deleted successfully");
    }

    public String getImageUrl(String publicId) {
        return getCloudinary().url().generate(publicId);
    }
}
