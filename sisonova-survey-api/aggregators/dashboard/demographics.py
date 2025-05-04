import pandas as pd


def process_gender_distribution(df: pd.DataFrame):
    """
    This method returns the gender counts in the dataframe

    Args:
        df (pd.DataFrame): Dataframe of survey data
    Returns:

    """
    gender, gender_counts = df["GENDER"].mode()
