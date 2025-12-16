package in.LumiAI.api.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(
    name = "replicate",
    url = "${replicate.api.url:https://api.replicate.com}"
)
public interface ReplicateClient {

    @PostMapping(
        value = "/v1/predictions",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    Map<String, Object> createPrediction(
        @RequestHeader("Authorization") String authorization,
        @RequestBody Map<String, Object> request
    );

    @GetMapping(
        value = "/v1/predictions/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    Map<String, Object> getPrediction(
        @RequestHeader("Authorization") String authorization,
        @PathVariable("id") String predictionId
    );
}
