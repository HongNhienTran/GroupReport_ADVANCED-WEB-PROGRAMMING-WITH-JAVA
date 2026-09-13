package com.thesweetlabbe.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class EnvLoader {

    private static final Logger log = LoggerFactory.getLogger(EnvLoader.class);

    public static void load() {
        Path envPath = findEnvFile();
        if (envPath == null) {
            log.info("No .env file found. Falling back to system environment variables and application.yml defaults.");
            return;
        }

        log.info("Loading environment variables from: {}", envPath.toAbsolutePath());
        try (BufferedReader reader = Files.newBufferedReader(envPath)) {
            String line;
            int count = 0;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                int eqIdx = line.indexOf('=');
                if (eqIdx <= 0) {
                    continue;
                }
                String key = line.substring(0, eqIdx).trim();
                String value = line.substring(eqIdx + 1).trim();

                // Strip surrounding quotes if present
                if ((value.startsWith("\"") && value.endsWith("\"")) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                    if (value.length() >= 2) {
                        value = value.substring(1, value.length() - 1);
                    }
                }

                // Set system property only if not already provided by system env or existing property
                if (System.getProperty(key) == null && System.getenv(key) == null) {
                    System.setProperty(key, value);
                    count++;
                }
            }
            log.info("Successfully loaded {} environment variables from .env", count);
        } catch (IOException e) {
            log.warn("Failed to read .env file: {}", e.getMessage());
        }
    }

    private static Path findEnvFile() {
        Path[] searchLocations = new Path[]{
                Paths.get(".env"),
                Paths.get("../.env"),
                Paths.get("the-sweet-lab-be/.env")
        };
        for (Path path : searchLocations) {
            if (Files.exists(path) && Files.isRegularFile(path)) {
                return path;
            }
        }
        return null;
    }
}
