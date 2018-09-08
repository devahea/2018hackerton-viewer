package ahea.hackerton.nurikabe.viewer;

import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.HtmlUtils;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@Controller
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Autowired
    SimpMessagingTemplate template;

    @RequestMapping("/create")
    public @ResponseBody String create(String name, Integer x, Integer y, String method, Integer number, String message){

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", name);
        jsonObject.addProperty("x", x);
        jsonObject.addProperty("y", y);
        jsonObject.addProperty("method", "create");

        System.out.println("jsonObject.toString() " + jsonObject.toString());

        template.convertAndSend("/topic/greetings",
                jsonObject.toString());
        return "goods";
    }

    @RequestMapping("/putItem")
    public @ResponseBody String putMessage(String name, Integer x, Integer y, String method, Integer number, String message){

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", name);
        jsonObject.addProperty("x", x);
        jsonObject.addProperty("y", y);
        jsonObject.addProperty("method", method);
        jsonObject.addProperty("number", number);
        jsonObject.addProperty("message", message);

        System.out.println("jsonObject.toString() " + jsonObject.toString());

        template.convertAndSend("/topic/greetings",
                jsonObject.toString());
        return "goods";
    }


    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay

        System.out.println("Message " + message);

        return message.getName();
    }
}
