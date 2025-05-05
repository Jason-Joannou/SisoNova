import pandas as pd
from utils.config import (
    DEMOGRAPHIC_COLUMNS,
    FINANCIAL_ACCESS_COLUMNS,
    FINANCIAL_BARRIERS_COLUMNS,
    INCOME_MANAGEMENT_COLUMNS,
    PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS,
    PSYCHOLOGICAL_BARRIERS_COLUMNS,
    TECHNOLOGY_UNDERSTANDING_COLUMNS,
)
from utils.utils import format_number_columns, get_column_value_counts


def process_demographic_columns(df: pd.DataFrame):
    """
    This method creates counts for each column in the
    demographic question in the survey and returns a dictionary as the result.

    Args:
        df (pd.DataFrame): DataFrame holding the survey data
    """

    results = {
        value: get_column_value_counts(column=value, df=df)
        for _, value in DEMOGRAPHIC_COLUMNS.items()
    }

    return results


def process_income_columns(df: pd.DataFrame):
    """
    This method creates counts for each column in the
    income question in the survey and returns a dictionary as the result.

    Args:
        df (pd.DataFrame): DataFrame holding the survey data
    """

    avg_columns = ["HOUSEHOLD_SIZE", "INCOME_EARNERS_COUNT"]

    results = {
        value: (
            {"avg": format_number_columns(df[value].to_list())}
            if value in avg_columns
            else get_column_value_counts(column=value, df=df)
        )
        for _, value in PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS.items()
    }

    return results


def process_income_management_columns(df: pd.DataFrame):
    """
    Creates counts for each income management-related checkbox/multi-select column.
    """
    checkbox_columns = ["CASH_SHORTAGE_STRATEGIES", "SPENDING_MANAGEMENT_TOOLS"]

    results = {
        value: get_column_value_counts(
            column=value, df=df, is_checkbox=value in checkbox_columns
        )
        for _, value in INCOME_MANAGEMENT_COLUMNS.items()
    }

    return results


def process_financial_access_columns(df: pd.DataFrame):
    """
    Creates counts for each income management-related checkbox/multi-select column.
    """
    checkbox_columns = [
        "ACCOUNT_USAGE_PURPOSES",
        "MULTIPLE_ACCOUNTS_REASONS",
        "MOST_USED_FINANCIAL_SERVICES",
        "ACCOUNT_TYPES",
        "TRUSTED_FINANCIAL_SERVICES",
        "FINANCIAL_SERVICE_ISSUES",
    ]

    results = {
        value: get_column_value_counts(
            column=value, df=df, is_checkbox=value in checkbox_columns
        )
        for _, value in FINANCIAL_ACCESS_COLUMNS.items()
    }

    return results


def process_financial_barriers_columns(df: pd.DataFrame):
    """
    Creates counts for each income management-related checkbox/multi-select column.
    """
    checkbox_columns = [
        "FINANCIAL_SERVICE_CONCERNS",
    ]

    avg_columns = ["FINANCIAL_CONFIDENCE"]

    results = {
        value: (
            {"avg": format_number_columns(df[value].to_list())}
            if value in avg_columns
            else get_column_value_counts(
                column=value, df=df, is_checkbox=value in checkbox_columns
            )
        )
        for _, value in FINANCIAL_BARRIERS_COLUMNS.items()
    }

    return results


def process_psychological_barriers_columns(df: pd.DataFrame):
    """
    Creates counts for each income management-related checkbox/multi-select column.
    """
    checkbox_columns = [
        "SAVING_PERCEPTION",
    ]

    avg_columns = ["FINANCIAL_RISK_TOLERANCE"]

    results = {
        value: (
            {"avg": format_number_columns(df[value].to_list())}
            if value in avg_columns
            else get_column_value_counts(
                column=value, df=df, is_checkbox=value in checkbox_columns
            )
        )
        for _, value in PSYCHOLOGICAL_BARRIERS_COLUMNS.items()
    }

    return results


def process_technological_understanding_columns(df: pd.DataFrame):
    """
    Creates counts for each income management-related checkbox/multi-select column.
    """
    checkbox_columns = [
        "FINANCIAL_MANAGEMENT_DEVICES",
        "DIGITAL_FINANCE_CHALLENGES",
        "FINTECH_ADOPTION_MOTIVATORS",
        "FINANCIAL_APPS_USED",
    ]

    avg_columns = ["DIGITAL_SECURITY_TRUST"]

    results = {
        value: (
            {"avg": format_number_columns(df[value].to_list())}
            if value in avg_columns
            else get_column_value_counts(
                column=value, df=df, is_checkbox=value in checkbox_columns
            )
        )
        for _, value in TECHNOLOGY_UNDERSTANDING_COLUMNS.items()
    }

    return results
