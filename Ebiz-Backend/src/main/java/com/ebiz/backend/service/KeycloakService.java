package com.ebiz.backend.service;

import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class KeycloakService {

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin.client-id}")
    private String adminClientId;

    @Value("${keycloak.admin.secret}")
    private String adminSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    private Keycloak getKeycloakConfig() {
        log.debug("Configuring Keycloak client for server: {}, realm: {}, client: {}", serverUrl, realm, adminClientId);
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm) // Use the application realm
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(adminClientId)
                .clientSecret(adminSecret)
                .build();
    }

    public void createUser(String email, String rawPassword, String roleName, boolean enabled) {
        Keycloak keycloak = getKeycloakConfig();
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        // 1. Create User Representation
        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEmail(email);
        user.setEmailVerified(true); // Since we just verified OTP
        user.setEnabled(enabled);

        try {
            // 2. Persist User in Keycloak
            Response response = usersResource.create(user);

            if (response.getStatus() == 201) {
                String userId = org.keycloak.admin.client.CreatedResponseUtil.getCreatedId(response);

                // 3. Set User Password
                CredentialRepresentation credential = new CredentialRepresentation();
                credential.setTemporary(false);
                credential.setType(CredentialRepresentation.PASSWORD);
                credential.setValue(rawPassword);
                usersResource.get(userId).resetPassword(credential);

                // 4. Assign Role (using lowercase as per Keycloak setup)
                String keycloakRoleName = roleName.toLowerCase();
                RoleRepresentation realmRole = realmResource.roles().get(keycloakRoleName).toRepresentation();
                usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(realmRole));

                log.info("Successfully created Keycloak user for email: {}", email);
            } else {
                String errorInfo = response.readEntity(String.class);
                log.error("Failed to create user in Keycloak. Status: {}, Info: {}", response.getStatus(), errorInfo);
                throw new RuntimeException("Failed to register user in identity provider.");
            }
        } finally {
            if (keycloak != null) {
                keycloak.close();
            }
        }
    }

    public void enableUser(String email) {
        Keycloak keycloak = getKeycloakConfig();
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        try {
            List<UserRepresentation> users = usersResource.searchByEmail(email, true);
            if (users.isEmpty()) {
                throw new RuntimeException("User not found in Keycloak with email: " + email);
            }

            UserRepresentation user = users.get(0);
            user.setEnabled(true);
            usersResource.get(user.getId()).update(user);

            log.info("Successfully enabled Keycloak user for email: {}", email);
        } finally {
            if (keycloak != null) {
                keycloak.close();
            }
        }
    }

    public boolean checkUserExists(String email) {
        log.info("Checking if user exists in Keycloak: {}", email);
        Keycloak keycloak = null;
        try {
            keycloak = getKeycloakConfig();
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();
            List<UserRepresentation> users = usersResource.searchByEmail(email, true);
            boolean exists = !users.isEmpty();
            log.debug("User {} exists in Keycloak: {}", email, exists);
            return exists;
        } catch (jakarta.ws.rs.NotAuthorizedException e) {
            log.error("Keycloak admin authentication failed. Please check credentials in application.yml: {}",
                    e.getMessage());
            throw new RuntimeException("Backend configuration error: Identity provider authentication failed.");
        } catch (jakarta.ws.rs.WebApplicationException e) {
            log.error("Keycloak API error (Status {}): {}", e.getResponse().getStatus(), e.getMessage());
            throw new RuntimeException("Identity provider service error.");
        } catch (Exception e) {
            log.error("Unexpected error while checking user existence in Keycloak", e);
            throw new RuntimeException("Internal error communicating with identity provider.");
        } finally {
            if (keycloak != null) {
                keycloak.close();
            }
        }
    }

    public ResponseEntity<Map> loginUser(String username, String password) {
        String tokenUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("client_id", adminClientId);
        map.add("client_secret", adminSecret); // Added for confidential client
        map.add("username", username);
        map.add("password", password);
        map.add("grant_type", "password");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            return response;
        } catch (Exception e) {
            log.error("Error during Keycloak login for user {}: {}", username, e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }
}
