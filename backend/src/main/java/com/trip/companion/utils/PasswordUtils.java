package com.trip.companion.utils;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.passay.AllowedCharacterRule;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.LengthRule;
import org.passay.PasswordData;
import org.passay.PasswordGenerator;
import org.passay.PasswordValidator;
import org.passay.RuleResult;

import static org.passay.EnglishCharacterData.Digit;
import static org.passay.EnglishCharacterData.LowerCase;
import static org.passay.EnglishCharacterData.Special;
import static org.passay.EnglishCharacterData.UpperCase;

public class PasswordUtils {

    private PasswordUtils() {
    }

    private static final PasswordValidator PASSWORD_VALIDATOR = createPasswordValidator();

    private static PasswordValidator createPasswordValidator() {
        char[] allowedChars = Stream.of(UpperCase, LowerCase, Digit, Special)
                .map(EnglishCharacterData::getCharacters)
                .collect(Collectors.joining())
                .toCharArray();
        return new PasswordValidator(List.of(
                new LengthRule(8, 16),
                new AllowedCharacterRule(allowedChars),
                new CharacterRule(UpperCase),
                new CharacterRule(LowerCase),
                new CharacterRule(Digit),
                new CharacterRule(Special)
        ));
    }

    public static RuleResult validatePassword(String password) {
        return PASSWORD_VALIDATOR.validate(new PasswordData(password));
    }

    public static List<String> getPasswordValidationErrors(RuleResult result) {
        return PASSWORD_VALIDATOR.getMessages(result);
    }

    public static String generatePassword() {
        return new PasswordGenerator().generatePassword(8,
                new CharacterRule(UpperCase),
                new CharacterRule(LowerCase),
                new CharacterRule(Digit),
                new CharacterRule(Special));
    }

}
