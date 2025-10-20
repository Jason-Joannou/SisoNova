WHITELIST_URL_COLLECTION_SCHEMA = {
    "name": "Whitelist URL Collection Schema",
    "description": "Schema for the regulatory URL whitelist collection in MongoDB. All keys must be in snake_case format (lowercase with underscores).",
    "structure": {
        "type": "nested_dictionary",
        "format": "country -> province -> category -> subcategory -> urls[]",
        "levels": [
            {
                "level": 1,
                "name": "country",
                "type": "string",
                "format": "snake_case",
                "description": "Country identifier",
                "example": "south_africa"
            },
            {
                "level": 2,
                "name": "province",
                "type": "string",
                "format": "snake_case",
                "description": "Province/state identifier",
                "example": "western_cape"
            },
            {
                "level": 3,
                "name": "category",
                "type": "string",
                "format": "snake_case",
                "description": "Industry category",
                "example": "fishing"
            },
            {
                "level": 4,
                "name": "subcategory",
                "type": "string",
                "format": "snake_case",
                "description": "Industry subcategory",
                "example": "commercial_fishing"
            },
            {
                "level": 5,
                "name": "urls",
                "type": "array",
                "description": "Array of URL objects",
                "items": {
                    "type": "object",
                    "required": ["url", "description", "added_at", "modified_at"],
                    "properties": {
                        "url": {
                            "type": "string",
                            "format": "https URL",
                            "description": "HTTPS URL of the regulatory website"
                        },
                        "description": {
                            "type": "string",
                            "description": "Description of the regulatory information"
                        },
                        "added_at": {
                            "type": "datetime",
                            "format": "ISO 8601",
                            "description": "Timestamp when entry was created"
                        },
                        "modified_at": {
                            "type": "datetime",
                            "format": "ISO 8601",
                            "description": "Timestamp when entry was last modified"
                        }
                    }
                }
            }
        ]
    },
    "example": {
        "south_africa": {
            "western_cape": {
                "fishing": {
                    "commercial_fishing": [
                        {
                            "url": "https://example.com/fishing-regs",
                            "description": "Commercial fishing regulations and licensing",
                            "added_at": "2025-10-20T10:30:00.000Z",
                            "modified_at": "2025-10-20T10:30:00.000Z"
                        }
                    ]
                }
            }
        }
    },
    "rules": [
        "All keys (country, province, category, subcategory) must be snake_case",
        "URLs must start with https://",
        "All datetime fields must be ISO 8601 format"
    ]
}