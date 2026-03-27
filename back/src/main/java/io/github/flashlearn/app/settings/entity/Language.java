package io.github.flashlearn.app.settings.entity;

public enum Language {
    EN("en"),
    RU("ru");

    private final String value;

    Language(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
