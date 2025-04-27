import numpy as np
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
    number_of_male_participants = len(df)
    # Demographics

    most_frequent_male_age_group = df["AGE_GROUP"].mode()[0]
    most_frequent_male_province = df["PROVINCE"].mode()[0]
    most_frequent_male_living_location = df["LOCATION"].mode()[0]
    most_frequent_employment_status = df["EMPLOYMENT_STATUS"].mode()[0]
    most_frequent_education_level = df["EDUCATION_COMPLETED"].mode()[0]

    # Personal and household income

    most_frequent_personal_income = df["PERSONAL_INCOME"].mode()[0]
    most_frequent_household_income = df["HOUSEHOLD_INCOME"].mode()[0]
    most_frequent_source_of_income = df["SOURCE_OF_INCOME"].mode()[0]

    people_in_household_list = df["PEOPLE_IN_HOUSEHOLD"].to_list()
    formatted_people_in_household_list = []

    for number in people_in_household_list:
        if len(number) > 1:
            formatted_number = int(number[0])
            formatted_people_in_household_list.append(formatted_number)
        else:
            formatted_people_in_household_list.append(int(number))

    average_people_in_household = np.mean(formatted_people_in_household_list)

    earn_income_in_household = df["EARN_INCOME_IN_HOUSEHOLD"].to_list()
    formatted_earn_income_in_household = []

    for number in earn_income_in_household:
        if len(number) > 1:
            formatted_number = int(number)
            formatted_earn_income_in_household.append(formatted_number)
        else:
            formatted_earn_income_in_household.append(int(number))

    average_income_in_household = np.mean(formatted_earn_income_in_household)
