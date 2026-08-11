package com.complaint.system.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return Role.USER.name();
        }
        return role.name();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Role.USER;
        }
        try {
            return Role.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return Role.USER;
        }
    }
}
