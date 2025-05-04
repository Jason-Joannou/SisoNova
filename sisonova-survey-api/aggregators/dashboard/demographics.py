import pandas as pd
from utils.config import DEMOGRAPHIC_COLUMNS, PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS
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
        for _, value in DEMOGRAPHIC_COLUMNS.items()
    }

    return results
