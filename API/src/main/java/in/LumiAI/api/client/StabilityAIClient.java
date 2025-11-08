// in.LumiAI.api.client.StabilityAIClient
package in.LumiAI.api.client;

import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import in.LumiAI.api.config.FeignConfig;
import in.LumiAI.api.dto.TextToImageRequest;

@FeignClient(
        name = "stability",
        url = "${stability.api.url:https://api.stability.ai}",
        configuration = FeignConfig.class
)
public interface StabilityAIClient {

    // ✅ IMAGE → IMAGE uses MULTIPART and specific field names
    @PostMapping(
            value = "/v1/generation/{engineId}/image-to-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Headers("Accept: image/png")
    byte[] generateImageFromImage(
            @RequestHeader("Authorization") String auth,
            @PathVariable("engineId") String engineId,

            // 👇 the correct field name
            @RequestPart("init_image") MultipartFile initImage,

            // 👇 Stability expects text_prompts array keys in multipart
            @RequestPart("text_prompts[0][text]") String textPrompt,

            // optional but useful
            @RequestPart(value = "style_preset", required = false) String stylePreset,
            @RequestPart(value = "image_strength", required = false) Double imageStrength
    );

    // ✅ TEXT → IMAGE (JSON body) – this already works for you
    @PostMapping(
            value = "/v1/generation/{engineId}/text-to-image",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @Headers("Accept: image/png")
    byte[] generateImageFromText(
            @RequestHeader("Authorization") String auth,
            @PathVariable("engineId") String engineId,
            @RequestBody TextToImageRequest request
    );
}
