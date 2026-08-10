package com.complaint.system.dto;

import com.complaint.system.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(
            min = 10,
            max = 3000,
            message = "Description must contain 10 to 3000 characters"
    )
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @Size(max = 500, message = "Location cannot exceed 500 characters")
    private String location;
}