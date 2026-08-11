package com.complaint.system.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PriorityConverter implements AttributeConverter<Priority, String> {

    @Override
    public String convertToDatabaseColumn(Priority priority) {
        if (priority == null) {
            return Priority.MEDIUM.name();
        }
        return priority.name();
    }

    @Override
    public Priority convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Priority.MEDIUM;
        }
        try {
            return Priority.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return Priority.MEDIUM;
        }
    }
}
