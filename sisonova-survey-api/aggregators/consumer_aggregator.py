import pandas as pd

from utils.gs_client import load_gs_client

# The idea is to build a story line for each of the sections in the survey
# So whats the storyline
# Ie this is our average male user
# on average he supports x
# on average he struggles with y
# Then we conclude our findings at the end


def get_male_demographic_statistics(df: pd.DataFrame):
    """
    Gets the statistics of all the male survey participants

    Args:
        df (pd.DataFrame): A dataframe containing the demographic information.

    Returns:
        dict: Male statistics
    """

    male_df = df[df["GENDER"] == "Male"].copy()

    # Demographics

    number_of_male_participants = len(df)
    most_frequent_male_age_group = df["AGE_GROUP"].mode()[0]
    most_frequent_male_province = df["PROVINCE"].mode()[0]
    most_frequent_male_living_location = df["LOCATION"].mode()[0]
    most_frequent_employment_status = df["EMPLOYMENT_STATUS"].mode()[0]
    most_frequent_education_level = df["EDUCATION_COMPLETED"].mode()[0]
