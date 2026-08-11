package com.complaint.system.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ComplaintStatusConverter implements AttributeConverter<ComplaintStatus, String> {

    @Override
    public String convertToDatabaseColumn(ComplaintStatus status) {
        if (status == null) {
            return ComplaintStatus.SUBMITTED.name();
        }
        return status.name();
    }

    @Override
    public ComplaintStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return ComplaintStatus.SUBMITTED;
        }
        try {
            return ComplaintStatus.valueOf(dbData.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ComplaintStatus.SUBMITTED;
        }
    }
}
