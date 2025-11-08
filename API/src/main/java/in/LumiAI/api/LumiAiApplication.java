package in.LumiAI.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class LumiAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LumiAiApplication.class, args);
	}

}
