import pandas as pd
from utils.config import DEMOGRAPHIC_COLUMNS
from utils.utils import get_column_value_counts, get_survey_results_into_df


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


def process_gender_distribution(df: pd.DataFrame):
    """
    This method returns the gender counts in the dataframe

    Args:
        df (pd.DataFrame): Dataframe of survey data
    Returns:
        list: A list of dictionaires counting the counts
    """
    if df.empty:
        return []
    gender_counts = get_column_value_counts(column="GENDER", df=df)

    return gender_counts


def process_age_group_distributions(df: pd.DataFrame):
    """
    This method returns the age group counts in the dataframe

    Args:
        df (pd.DataFrame): Dataframe of survey data
    Returns:
        list: A list of dictionaires counting the counts
    """

    if df.empty:
        return []
    age_counts = get_column_value_counts(column="AGE_GROUP", df=df)
    return age_counts


def process_geographic_distribution(df: pd.DataFrame):
    """
    This method returns the geographic counts in the dataframe

    Args:
        df (pd.DataFrame): Dataframe of survey data
    Returns:
        list: A list of dictionaires counting the counts
    """

    if df.empty:
        return []
    age_counts = get_column_value_counts(column="PROVINCE", df=df)
    return age_counts


def process_education_distribution(df: pd.DataFrame):
    """
    This method returns the education counts in the dataframe

    Args:
        df (pd.DataFrame): Dataframe of survey data
    Returns:
        list: A list of dictionaires counting the counts
    """

    if df.empty:
        return []
    education_counts = get_column_value_counts(column="EDUCATION_LEVEL", df=df)
    return education_counts
