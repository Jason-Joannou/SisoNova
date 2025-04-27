from typing import List

from utils.config import DEMOGRAPHIC_COLUMNS, PERSONAL_AND_HOUSEHOLD_INCOME


class SurveyMappingError(Exception):
    """
    Custom Error Class for the survey mapping
    """

    def __init__(self, message: str):
        super().__init__(message)


def map_demographics_to_standard(columns_to_map: List[str]):
    """
    This method maps the survey column to standardised pandas columns to make it easier for aggregating.

    Args:
        columns_to_map (List[str]): The columns coming from the google sheets.

    Returns:
        List[str]: The newly mapped column names as a list of strings
    """

    columns_to_keep = []

    for column in columns_to_map:
        if column in DEMOGRAPHIC_COLUMNS:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        DEMOGRAPHIC_COLUMNS
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Demographic columns to not match in length. {len(columns_to_keep)} != {len(DEMOGRAPHIC_COLUMNS)} (truth)"
        )

    mapping = {
        "What age group do you belong to?": "AGE_GROUP",
        "What is your gender?": "GENDER",
        "Which province do you currently live in?": "PROVINCE",
        "How would you best describe the area you live?": "LOCATION",
        "What is your current employment status?": "EMPLOYMENT_STATUS",
        "What is your highest level of education completed?": "EDUCATION_COMPLETED",
    }

    new_columns = [mapping[value] for value in columns_to_keep]

    return new_columns


def map_personal_and_household_income_to_standard(columns_to_map: List[str]):
    """
    This method maps the survey column to standardised pandas columns to make it easier for aggregating.

    Args:
        columns_to_map (List[str]): The columns coming from the google sheets.

    Returns:
        List[str]: The newly mapped column names as a list of strings
    """

    columns_to_keep = []

    for column in columns_to_map:
        if column in PERSONAL_AND_HOUSEHOLD_INCOME:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        PERSONAL_AND_HOUSEHOLD_INCOME
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Personal and Household Income columns do not match in length. {len(columns_to_keep)} != {len(PERSONAL_AND_HOUSEHOLD_INCOME)} (truth)"
        )

    mapping = {
        "What is your average personal monthly income?": "PERSONAL_INCOME",
        "What is your primary source of income?": "SOURCE_OF_INCOME",
        "Including yourself, how many people live in your household?": "PEOPLE_IN_HOUSEHOLD",
        "Including yourself, how many people earn an income in your household?": "EARN_INCOME_IN_HOUSEHOLD",
        "What is your average household monthly income?": "HOUSEHOLD_INCOME",
    }

    new_columns = [mapping[value] for value in columns_to_keep]

    return new_columns
