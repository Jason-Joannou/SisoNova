from typing import List

from utils.config import (
    DEMOGRAPHIC_COLUMNS,
    FINANCIAL_ACCESS_COLUMNS,
    FINANCIAL_BARRIERS_COLUMNS,
    INCOME_MANAGEMENT_COLUMNS,
    PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS,
    PSYCHOLOGICAL_BARRIERS_COLUMNS,
    TECHNOLOGY_UNDERSTANDING_COLUMNS,
)


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

    new_columns = [DEMOGRAPHIC_COLUMNS[value] for value in columns_to_keep]

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
        if column in PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Personal and Household Income columns do not match in length. {len(columns_to_keep)} != {len(PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS)} (truth)"
        )

    new_columns = [
        PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS[value] for value in columns_to_keep
    ]

    return new_columns


def map_income_managment_to_standard(columns_to_map: List[str]):
    """
    This method maps the survey column to standardised pandas columns to make it easier for aggregating.

    Args:
        columns_to_map (List[str]): The columns coming from the google sheets.

    Returns:
        List[str]: The newly mapped column names as a list of strings
    """

    columns_to_keep = []

    for column in columns_to_map:
        if column in INCOME_MANAGEMENT_COLUMNS:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        INCOME_MANAGEMENT_COLUMNS
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Personal and Household Income columns do not match in length. {len(columns_to_keep)} != {len(INCOME_MANAGEMENT_COLUMNS)} (truth)"
        )

    new_columns = [INCOME_MANAGEMENT_COLUMNS[value] for value in columns_to_keep]

    return new_columns


def map_financial_access_to_standard(columns_to_map: List[str]):
    """
    This method maps the survey column to standardised pandas columns to make it easier for aggregating.

    Args:
        columns_to_map (List[str]): The columns coming from the google sheets.

    Returns:
        List[str]: The newly mapped column names as a list of strings
    """

    columns_to_keep = []

    for column in columns_to_map:
        if column in FINANCIAL_ACCESS_COLUMNS:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        FINANCIAL_ACCESS_COLUMNS
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Personal and Household Income columns do not match in length. {len(columns_to_keep)} != {len(FINANCIAL_ACCESS_COLUMNS)} (truth)"
        )

    new_columns = [FINANCIAL_ACCESS_COLUMNS[value] for value in columns_to_keep]

    return new_columns


def map_financial_barriers_to_standard(columns_to_map: List[str]):
    """
    This method maps the survey column to standardised pandas columns to make it easier for aggregating.

    Args:
        columns_to_map (List[str]): The columns coming from the google sheets.

    Returns:
        List[str]: The newly mapped column names as a list of strings
    """

    columns_to_keep = []

    for column in columns_to_map:
        if column in FINANCIAL_BARRIERS_COLUMNS:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        FINANCIAL_BARRIERS_COLUMNS
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Personal and Household Income columns do not match in length. {len(columns_to_keep)} != {len(FINANCIAL_BARRIERS_COLUMNS)} (truth)"
        )

    new_columns = [FINANCIAL_BARRIERS_COLUMNS[value] for value in columns_to_keep]

    return new_columns


def map_technology_understanding_to_standard(columns_to_map: List[str]):
    """
    This method maps the survey column to standardised pandas columns to make it easier for aggregating.

    Args:
        columns_to_map (List[str]): The columns coming from the google sheets.

    Returns:
        List[str]: The newly mapped column names as a list of strings
    """

    columns_to_keep = []

    for column in columns_to_map:
        if column in TECHNOLOGY_UNDERSTANDING_COLUMNS:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        TECHNOLOGY_UNDERSTANDING_COLUMNS
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Personal and Household Income columns do not match in length. {len(columns_to_keep)} != {len(TECHNOLOGY_UNDERSTANDING_COLUMNS)} (truth)"
        )

    new_columns = [TECHNOLOGY_UNDERSTANDING_COLUMNS[value] for value in columns_to_keep]

    return new_columns


def map_phsycological_barriers_to_standard(columns_to_map: List[str]):
    """
    This method maps the survey column to standardised pandas columns to make it easier for aggregating.

    Args:
        columns_to_map (List[str]): The columns coming from the google sheets.

    Returns:
        List[str]: The newly mapped column names as a list of strings
    """

    columns_to_keep = []

    for column in columns_to_map:
        if column in PSYCHOLOGICAL_BARRIERS_COLUMNS:
            columns_to_keep.append(column)

    if len(columns_to_keep) != len(
        PSYCHOLOGICAL_BARRIERS_COLUMNS
    ):  # Check to see if we have all the columns
        raise SurveyMappingError(
            f"Personal and Household Income columns do not match in length. {len(columns_to_keep)} != {len(PSYCHOLOGICAL_BARRIERS_COLUMNS)} (truth)"
        )

    new_columns = [PSYCHOLOGICAL_BARRIERS_COLUMNS[value] for value in columns_to_keep]

    return new_columns
