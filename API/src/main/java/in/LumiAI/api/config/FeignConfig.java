// in.LumiAI.api.config.FeignConfig
package in.LumiAI.api.config;

import feign.RequestInterceptor;
import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class FeignConfig {

    @Bean
    public Encoder feignFormEncoder() {
        return new SpringFormEncoder(
                new SpringEncoder(() -> new HttpMessageConverters(new RestTemplate().getMessageConverters()))
        );
    }

    // 🔒 Stability requires Accept to be ONLY image/png or ONLY application/json.
    @Bean
    public RequestInterceptor forceAcceptPng() {
        return template -> {
            // remove any previously set Accept values (defensive)
            template.headers().remove("Accept");
            template.header("Accept", "image/png");
        };
    }

}
