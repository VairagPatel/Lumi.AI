package in.LumiAI.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing
@Slf4j
public class LumiAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LumiAiApplication.class, args);
		log.info("==============================================");
		log.info("🚀 Lumi AI Backend Started Successfully!");
		log.info("📚 Swagger UI: http://localhost:8080/swagger-ui.html");
		log.info("❤️ Health Check: http://localhost:8080/api/v1/health");
		log.info("==============================================");
	}
}
