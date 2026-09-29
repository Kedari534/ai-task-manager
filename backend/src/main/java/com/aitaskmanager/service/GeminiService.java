package com.aitaskmanager.service;

import com.aitaskmanager.model.AILog;
import com.aitaskmanager.model.User;
import com.aitaskmanager.repository.AILogRepository;
import com.aitaskmanager.repository.UserRepository;
import com.aitaskmanager.repository.TaskRepository;
import com.aitaskmanager.model.Task;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class GeminiService {

    @Value("${aitask.gemini.api-key}")
    private String apiKey;

    @Value("${aitask.gemini.url}")
    private String apiUrl;

    @Autowired
    private AILogRepository aiLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> generateTaskDetails(String title) {
        String prompt = """
                Generate task details for this task title: "%s"

                Return ONLY valid JSON with no extra text, no markdown, no backticks.

                Format:
                {
                  "description": "string",
                  "priority": "HIGH or MEDIUM or LOW",
                  "estimatedTime": "string like 2 hours or 30 minutes",
                  "dueDate": "string in YYYY-MM-DD format representing an estimated realistic deadline"
                }
                """.formatted(title);

        try {
            System.out.println("Calling Google Gemini API...");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("role", "user", 
                           "parts", List.of(Map.of("text", prompt)))
                )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                apiUrl + "?key=" + apiKey, entity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String aiText = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();

                // Clean any accidental markdown
                aiText = aiText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

                // Extract JSON object only
                int start = aiText.indexOf("{");
                int end = aiText.lastIndexOf("}");
                if (start != -1 && end != -1) {
                    aiText = aiText.substring(start, end + 1);
                }

                Map<String, Object> result = objectMapper.readValue(aiText, Map.class);
                logAI(title, aiText);
                return result;
            }

        } catch (Exception e) {
            System.err.println("Google Gemini API Error: " + e.getMessage());
            e.printStackTrace();
        }

        // Fallback response
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("description", "AI service unavailable. Please fill manually.");
        fallback.put("priority", "MEDIUM");
        fallback.put("estimatedTime", "1 hour");
        return fallback;
    }

    public String listModels() {
        return "Using Google Gemini API with model: gemini-3.6-flash";
    }

    public Map<String, Object> chatWithAI(String message, List<Map<String, String>> history) {
        String contextStr = "";
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails userDetails) {
                User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
                if (user != null) {
                    List<Task> tasks = taskRepository.findByUser(user);
                    if (tasks != null && !tasks.isEmpty()) {
                        contextStr = "\n\nCURRENT USER TASKS FROM DATABASE:\n";
                        for (Task t : tasks) {
                            if (t.getStatus() != Task.Status.COMPLETED) {
                                contextStr += "- " + t.getTitle() + " (Priority: " + t.getPriority() + ", Due: " + (t.getDueDate() != null ? t.getDueDate() : "None") + ")\n";
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Could not fetch user tasks: " + e.getMessage());
        }

        String systemPrompt = """
                You are TaskFlow AI Copilot, a premium, professional productivity and task management assistant.
                You help users plan, organize, and complete their workload.
                
                You can help users break down tasks or suggest tasks.
                If the user wants to add a task, you can help them draft it. Always format your suggestions nicely.
                If they explicitly request to create or add a task (e.g. "Add a high priority task: Complete tax filing by tomorrow" or "Create a task for learning React Native"), you should include a special JSON command at the very end of your response so the frontend can offer a one-click button to create it!
                
                Format the JSON command EXACTLY like this on its own line:
                [CMD_CREATE_TASK]:{"title": "Task title", "description": "AI-suggested description", "priority": "HIGH/MEDIUM/LOW", "estimatedTime": "duration", "dueDate": "YYYY-MM-DD"}
                
                Keep your main response friendly, professional, structured in markdown, and short.
                """ + contextStr;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<Map<String, Object>> contents = new ArrayList<>();
            if (history != null) {
                for (Map<String, String> entry : history) {
                    // Normalize roles for Gemini
                    String role = entry.get("role").equals("assistant") ? "model" : "user";
                    contents.add(Map.of(
                        "role", role,
                        "parts", List.of(Map.of("text", entry.get("content")))
                    ));
                }
            }
            contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", message))
            ));
            
            Map<String, Object> systemInstruction = Map.of(
                "parts", List.of(Map.of("text", systemPrompt))
            );

            Map<String, Object> requestBody = Map.of(
                "systemInstruction", systemInstruction,
                "contents", contents
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                apiUrl + "?key=" + apiKey, entity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String aiText = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();

                logAI(message, aiText);
                return Map.of("response", aiText);
            }
        } catch (Exception e) {
            System.err.println("Google Gemini Chat Error: " + e.getMessage());
            e.printStackTrace();
        }

        return Map.of("response", "I'm sorry, I encountered an error while reaching my AI services. Please try again in a moment.");
    }

    private void logAI(String prompt, String response) {
        try {
            Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

            if (principal instanceof UserDetails userDetails) {
                User user = userRepository
                    .findByUsername(userDetails.getUsername())
                    .orElse(null);

                AILog log = new AILog();
                log.setUser(user);
                log.setPrompt(prompt);
                log.setResponse(response);

                aiLogRepository.save(log);
            }
        } catch (Exception e) {
            System.out.println("AI Log Save Failed: " + e.getMessage());
        }
    }
}
