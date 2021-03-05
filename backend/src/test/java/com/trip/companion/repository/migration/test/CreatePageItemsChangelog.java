package com.trip.companion.repository.migration.test;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.mongodb.client.MongoDatabase;
import com.trip.companion.domain.Gender;
import com.trip.companion.domain.Language;
import com.trip.companion.domain.page.Page;
import com.trip.companion.domain.user.LanguageLevel;
import com.trip.companion.domain.user.Status;
import java.util.ArrayList;
import java.util.List;
import org.bson.Document;

import static com.trip.companion.domain.Language.ENG;
import static com.trip.companion.domain.Language.RUS;
import static com.trip.companion.domain.Language.UKR;
import static com.trip.companion.domain.page.Page.USER_ACCOUNT;
import static com.trip.companion.domain.page.Page.WELCOME;

@ChangeLog(order = "001")
public class CreatePageItemsChangelog {

    private static final List<Document> DOCUMENTS = new ArrayList<>();

    @ChangeSet(order = "001", id = "createWelcomePageItems", author = "skosinskyi")
    public void initWelcomePageItems(MongoDatabase db) {
        DOCUMENTS.clear();

        String destination = "main.searchArea.destination";
        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, destination, "Destination"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, destination, "Пункт призначення"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, destination, "Пункт назначения"));

        String destinationPlaceholder = "main.searchArea.destination.placeholder";
        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, destinationPlaceholder, "Choose a destination"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, destinationPlaceholder, "Виберіть пункт призначення"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, destinationPlaceholder, "Выберите направление"));

        String dateRange = "main.searchArea.dateRange";
        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, dateRange, "Date range"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, dateRange, "Дати"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, dateRange, "Даты"));

        String dateRangePlaceholder = "main.searchArea.dateRange.placeholder";
        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, dateRangePlaceholder, "Choose departure and arrival dates"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, dateRangePlaceholder, "Виберіть дати відправлення та прибуття"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, dateRangePlaceholder, "Выберите даты отправления и прибытия"));

        String peopleCount = "main.searchArea.peopleCount";
        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, peopleCount, "People count"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, peopleCount, "Кількість людей"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, peopleCount, "Количество людей"));

        String submitButton = "main.searchArea.submitButton";
        DOCUMENTS.add(createPageItemDoc(ENG, WELCOME, submitButton, "Submit"));
        DOCUMENTS.add(createPageItemDoc(UKR, WELCOME, submitButton, "Пошук"));
        DOCUMENTS.add(createPageItemDoc(RUS, WELCOME, submitButton, "Искать"));

        db.getCollection("pageItem").insertMany(DOCUMENTS);
    }

    @ChangeSet(order = "002", id = "createUserAccountPageItems", author = "skosinskyi")
    public void initUserAccountPageItems(MongoDatabase db) {
        DOCUMENTS.clear();

        String chatButton = "header.buttons.buttonChat";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, chatButton, "Chat"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, chatButton, "Чат"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, chatButton, "Чат"));

        String postsButton = "header.buttons.buttonMyPosts";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, postsButton, "My posts"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, postsButton, "Мої оголошення"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, postsButton, "Мои обьявления"));

        String feedbackButton = "header.buttons.buttonFeedback";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, feedbackButton, "Feedback"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, feedbackButton, "Зворотній зв'язок"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, feedbackButton, "Обратная связь"));

        String emailInput = "personalInfo.email.emailInput";
        String email = "Email";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, emailInput, email));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, emailInput, email));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, emailInput, email));

        String emailButton = "personalInfo.email.button";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, emailButton, "Change email"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, emailButton, "Змінити email"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, emailButton, "Изменить email"));

        String passwordInput = "personalInfo.password.passwordInput";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, passwordInput, "Password"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, passwordInput, "Пароль"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, passwordInput, "Пароль"));

        String repeatPasswordInput = "personalInfo.password.repeatPasswordInput";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, repeatPasswordInput, "Repeat password"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, repeatPasswordInput, "Повторіть пароль"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, repeatPasswordInput, "Повторите пароль"));

        String passwordButton = "personalInfo.password.button";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, passwordButton, "Change password"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, passwordButton, "Змінити пароль"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, passwordButton, "Изменить пароль"));

        String nameInput = "personalInfo.detailsInfo.nameInput";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, nameInput, "First name"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, nameInput, "Ім'я"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, nameInput, "Имя"));

        String lastNameInput = "personalInfo.detailsInfo.lastNameInput";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, lastNameInput, "Last name"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, lastNameInput, "Прізвище"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, lastNameInput, "Фамилия"));

        String status = "personalInfo.detailsInfo.status";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, status, "Pick your status"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, status, "Виберіть Ваш статус"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, status, "Выберите Ваш статус"));

        String statusAtHome = status + "." + Status.AT_HOME;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, statusAtHome, "At home"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, statusAtHome, "Дома"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, statusAtHome, "Дома"));

        String statusLookingForTravel = status + "." + Status.LOOKING_FOR_TRAVEL;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, statusLookingForTravel, "Looking for travel"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, statusLookingForTravel, "Шукаю подорож"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, statusLookingForTravel, "В поисках путешествия"));

        String statusTravelling = status + "." + Status.TRAVELLING;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, statusTravelling, "Travelling"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, statusTravelling, "Подорожую"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, statusTravelling, "Путешествую"));

        String yearsOld = "personalInfo.detailsInfo.yearsOld";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, yearsOld, "years  old"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, yearsOld, "років"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, yearsOld, "лет"));

        String gender = "personalInfo.detailsInfo.gender";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, gender, "Gender"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, gender, "Стать"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, gender, "Пол"));

        String genderMale = "personalInfo.detailsInfo.gender." + Gender.MALE;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, genderMale, "Male"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, genderMale, "Чоловік"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, genderMale, "Мужчина"));

        String genderFemale = "personalInfo.detailsInfo.gender." + Gender.FEMALE;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, genderFemale, "Female"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, genderFemale, "Жінка"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, genderFemale, "Женщина"));

        String description = "personalInfo.detailsInfo.description";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, description, "Description"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, description, "Опис"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, description, "Описание"));

        String descriptionPlaceholder = "personalInfo.detailsInfo.description.placeholder";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, descriptionPlaceholder, "About you"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, descriptionPlaceholder, "Про Вас"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, descriptionPlaceholder, "О Вас"));

        String languages = "personalInfo.detailsInfo.languages";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, languages, "Languages"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, languages, "Мови"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, languages, "Языки"));

        String languagesInput = "personalInfo.detailsInfo.languages.input";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, languagesInput, "Languages"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, languagesInput, "Мови"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, languagesInput, "Языки"));

        String languagesBeginner = languages + "." + LanguageLevel.BEGINNER;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, languagesBeginner, "Beginner"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, languagesBeginner, "Початківець"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, languagesBeginner, "Начинающий"));

        String languagesIntermediate = languages + "." + LanguageLevel.INTERMEDIATE;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, languagesIntermediate, "Intermediate"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, languagesIntermediate, "Середній"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, languagesIntermediate, "Средний"));

        String languagesAdvanced = languages + "." + LanguageLevel.ADVANCED;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, languagesAdvanced, "Advanced"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, languagesAdvanced, "Продвинутий"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, languagesAdvanced, "Продвинутий"));

        String languagesNative = languages + "." + LanguageLevel.NATIVE;
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, languagesNative, "Native"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, languagesNative, "Рідний"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, languagesNative, "Родной"));

        String interests = "personalInfo.detailsInfo.interests";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, interests, "My interests"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, interests, "Мої інтереси"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, interests, "Мои интересы"));

        String interestsPlaceholder = "personalInfo.detailsInfo.interests.placeholder";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, interestsPlaceholder, "New interest..."));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, interestsPlaceholder, "Новий інтерес..."));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, interestsPlaceholder, "Новый интерес..."));

        String skills = "personalInfo.detailsInfo.skills";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, skills, "My skills"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, skills, "Мої навики"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, skills, "Мои навыки"));

        String skillsInput = "personalInfo.detailsInfo.skills.input";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, skillsInput, "Choose skills"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, skillsInput, "Виберіть навики"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, skillsInput, "Выберите навыки"));

        String skillsDescription = "personalInfo.detailsInfo.skills.description";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, skillsDescription, "More details about your skills"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, skillsDescription, "Більше деталей про Ваші навики"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, skillsDescription, "Больше деталей о Ваших навыках"));

        String skillsDescriptionPlaceholder = "personalInfo.detailsInfo.skills.description.placeholder";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, skillsDescriptionPlaceholder, "More information"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, skillsDescriptionPlaceholder, "Більше інформації"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, skillsDescriptionPlaceholder, "Больше информации"));

        String skillsCanTeach = "personalInfo.detailsInfo.skills.canTeach";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, skillsCanTeach, "Can teach"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, skillsCanTeach, "Можу навчити"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, skillsCanTeach, "Могу научить"));

        String skillsKnown = "personalInfo.detailsInfo.skills.known";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, skillsKnown, "Some knowledge"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, skillsKnown, "Маю деякі знання"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, skillsKnown, "Имею некоторые знания"));

        String skillsInterestedIn = "personalInfo.detailsInfo.skills.interestedIn";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, skillsInterestedIn, "Interested in"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, skillsInterestedIn, "Хочу вивчити"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, skillsInterestedIn, "Хочу выучить"));

        String more = "personalInfo.detailsInfo.more";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, more, "Some additional information"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, more, "Додаткова інформація"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, more, "Дополнительная информация"));

        String submitButton = "personalInfo.detailsInfo.submitBtn";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, submitButton, "Submit"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, submitButton, "Зберегти"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, submitButton, "Сохранить"));

        String securityTitle = "personalInfo.securityTitle";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, securityTitle, "Security data"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, securityTitle, "Дані безпеки"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, securityTitle, "Данные безопасности"));

        String detailsTitle = "personalInfo.detailsTitle";
        DOCUMENTS.add(createPageItemDoc(ENG, USER_ACCOUNT, detailsTitle, "Personal data"));
        DOCUMENTS.add(createPageItemDoc(UKR, USER_ACCOUNT, detailsTitle, "Персональні дані"));
        DOCUMENTS.add(createPageItemDoc(RUS, USER_ACCOUNT, detailsTitle, "Личные данные"));

        db.getCollection("pageItem").insertMany(DOCUMENTS);
    }

    private Document createPageItemDoc(Language language, Page page, String item, String text) {
        Document content = new Document().append("text", text);
        return new Document()
                .append("language", language.name())
                .append("page", page.name())
                .append("item", item)
                .append("content", content);
    }
}
