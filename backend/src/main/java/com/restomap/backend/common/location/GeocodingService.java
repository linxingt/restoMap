package com.restomap.backend.common.location;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class GeocodingService {
    private static final Logger log = LoggerFactory.getLogger(GeocodingService.class);
    private final RestTemplate restTemplate;

    public GeocodingService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .connectTimeout(Duration.ofSeconds(2))
                .readTimeout(Duration.ofSeconds(2))
                .build();
    }

    public Double[] geocodeAddress(String address) {
        if (address == null || address.isBlank()) return null;
        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
            String url = "https://api-adresse.data.gouv.fr/search/?q=" + encodedAddress + "&limit=1";
            JsonNode root = restTemplate.getForObject(url, JsonNode.class);
            if (root != null && root.has("features") && !root.get("features").isEmpty()) {
                JsonNode coordinates = root.get("features").get(0).get("geometry").get("coordinates");
                double lon = coordinates.get(0).asDouble();
                double lat = coordinates.get(1).asDouble();
                return new Double[]{lat, lon};
            }
        } catch (Exception e) {
            log.warn("Échec du géocodage pour l'adresse '{}' : {}", address, e.getMessage());
        }
        return null;
    }
}
