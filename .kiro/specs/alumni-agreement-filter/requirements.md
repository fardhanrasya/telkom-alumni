# Requirements Document

## Introduction

This feature modification ensures that the alumni directory only counts and displays alumni who have given their agreement to be shown publicly. Currently, the system fetches all alumni data and filters them only at the display level, which causes incorrect pagination counts and misleading total numbers.

## Requirements

### Requirement 1

**User Story:** As a visitor browsing the alumni directory, I want to see accurate pagination information that reflects only the alumni who have agreed to be displayed, so that I understand the true number of available alumni profiles.

#### Acceptance Criteria

1. WHEN the system calculates total alumni count THEN it SHALL only include alumni where agreement = true
2. WHEN the system displays pagination information THEN it SHALL show counts based only on alumni with agreement = true
3. WHEN the system fetches alumni data for display THEN it SHALL only retrieve alumni where agreement = true

### Requirement 2

**User Story:** As a visitor using the search and filter functionality, I want the results to only include alumni who have agreed to be displayed, so that I don't see inflated result counts.

#### Acceptance Criteria

1. WHEN a user applies search filters THEN the system SHALL only count and return alumni where agreement = true
2. WHEN the system displays "Menampilkan X sampai Y dari Z alumni" THEN Z SHALL represent only alumni with agreement = true
3. WHEN no alumni with agreement = true match the search criteria THEN the system SHALL display "Tidak ada alumni yang ditemukan"

### Requirement 3

**User Story:** As a system administrator, I want the API to efficiently filter alumni by agreement status at the database level, so that the system performs optimally and doesn't transfer unnecessary data.

#### Acceptance Criteria

1. WHEN the API queries the database THEN it SHALL include agreement = true as a filter condition in the query
2. WHEN the API counts total alumni THEN it SHALL include agreement = true in the count query
3. WHEN the API returns paginated results THEN it SHALL only include alumni with agreement = true in both data and metadata
