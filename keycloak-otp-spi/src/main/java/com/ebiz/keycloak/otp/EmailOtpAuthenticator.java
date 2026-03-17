package com.ebiz.keycloak.otp;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.Authenticator;
import org.keycloak.email.EmailException;
import org.keycloak.email.EmailTemplateProvider;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.sessions.AuthenticationSessionModel;

import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class EmailOtpAuthenticator implements Authenticator {

    private static final String AUTH_NOTE_OTP = "email_otp";

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        UserModel user = context.getUser();
        if (user == null || user.getEmail() == null) {
            context.failureChallenge(AuthenticationFlowError.INVALID_USER,
                    context.form().setError("User has no email configured")
                            .createErrorPage(Response.Status.BAD_REQUEST));
            return;
        }

        // Generate a 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save OTP into the auth session notes
        AuthenticationSessionModel authSession = context.getAuthenticationSession();
        authSession.setAuthNote(AUTH_NOTE_OTP, otp);

        try {
            // Send email
            EmailTemplateProvider emailTemplateProvider = context.getSession().getProvider(EmailTemplateProvider.class);
            emailTemplateProvider.setRealm(context.getRealm());
            emailTemplateProvider.setUser(user);

            // You would normally create a custom freemarker email template, but for
            // simplicity we can send simple HTML/text or generic subject
            Map<String, Object> attributes = new HashMap<>();
            attributes.put("otp", otp);
            // emailTemplateProvider.send("otpEmailSubject", "otp-email.ftl", attributes);

            // For a basic implementation you can send plain text if you write an SPI
            // Mailer,
            // but Keycloak's EmailTemplateProvider is the standard. Assuming we add
            // otp-email.ftl later or just use an existing template.
            // A hacky way to send a generic email if you haven't set up the FTL theme is
            // below, but standard way assumes theme has it:
            emailTemplateProvider.send("Your Login Code", List.of("Your 6-digit login code is: " + otp),
                    "Your 6-digit login code is: " + otp);

        } catch (EmailException e) {
            context.failureChallenge(AuthenticationFlowError.INTERNAL_ERROR,
                    context.form().setError("Could not send email.")
                            .createErrorPage(Response.Status.INTERNAL_SERVER_ERROR));
            return;
        }

        // Display the OTP form to the user
        Response challenge = context.form().createForm("otp-form.ftl");
        context.challenge(challenge);
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
        String enteredOtp = formData.getFirst("otp");

        AuthenticationSessionModel authSession = context.getAuthenticationSession();
        String expectedOtp = authSession.getAuthNote(AUTH_NOTE_OTP);

        if (expectedOtp != null && expectedOtp.equals(enteredOtp)) {
            // Success! Clear the OTP from session and proceed
            authSession.removeAuthNote(AUTH_NOTE_OTP);
            context.success();
        } else {
            // Failure! Ask again
            Response challenge = context.form()
                    .setError("Invalid OTP code.")
                    .createForm("otp-form.ftl");
            context.failureChallenge(AuthenticationFlowError.INVALID_CREDENTIALS, challenge);
        }
    }

    @Override
    public boolean requiresUser() {
        return true;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return user.getEmail() != null;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
        // No required actions configured
    }

    @Override
    public void close() {
        // No resources to close
    }
}
