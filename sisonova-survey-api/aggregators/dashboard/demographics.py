import pandas as pd

from utils.utils import get_column_value_counts, get_survey_results_into_df


def process_gender_distribution(df: pd.DataFrame):
    """
    This method returns the gender counts in the dataframe

    Args:
        df (pd.DataFrame): Dataframe of survey data
    Returns:
        list: A list of dictionaires counting the counts
    """
    df = get_survey_results_into_df()
    if df.empty:
        return []
    gender_counts = get_column_value_counts(column="GENDER", df=df)

    return gender_counts
