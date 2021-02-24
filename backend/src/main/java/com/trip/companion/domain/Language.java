package com.trip.companion.domain;

import java.util.Locale;

public enum Language {
    ENG(Locale.ENGLISH), UKR(new Locale("uk")), RUS(new Locale("ru"));

    private Locale locale;

    Language(Locale locale) {
        this.locale = locale;
    }

    public Locale getLocale() {
        return locale;
    }
}
