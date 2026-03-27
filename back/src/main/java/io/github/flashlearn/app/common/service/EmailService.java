package io.github.flashlearn.app.common.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${spring.mail.from-name:FlashLearn}")
    private String fromName;

    /**
     * Send HTML email.
     *
     * @param toAddress recipient
     * @param subject   subject
     * @param htmlBody  html content
     * @throws MessagingException when sending fails
     */
    public void sendHtmlEmail(String toAddress, String subject, String htmlBody) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        helper.setFrom(fromAddress, fromName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true = isHtml
        mailSender.send(message);
        log.info("Sent email from {} ({}) to {}", fromAddress, fromName, toAddress);
    }
}
