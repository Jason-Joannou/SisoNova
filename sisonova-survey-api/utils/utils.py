from collections import Counter
from typing import List, Optional

import numpy as np
import pandas as pd

from utils.consumer_survey_mappings import rename_all_survey_columns
from utils.gs_client import load_gs_client


def get_column_value_counts(column: str, df: pd.DataFrame):
    """
    This method calculates the number of occurances in a column of its
    items and returns a list of dictionaries with the counts as key, value pairs.

    Args:
        column (str): The name of the column
        df (pd.DataFrame): Pandas dataframe holding the data
    Returns:
        list: A list of dictionaries with the item and its occurance as key, value pairs
    """

    counts = df[column].value_counts()
    formatted_counts = list(counts.items())

    results = [{k: v} for k, v in formatted_counts]

    return results


def get_survey_results_into_df():
    """
    This method retrieves the survey data from the google client,
    formats the columns, and returns a pandas dataframe equivelant.

    Returns:
        pd.DataFrame: DataFrame holding the survey data
    """
    try:
        client = load_gs_client()
        sheet = client.open("SisoNova Consumer Survey (Responses)").sheet1
        data = sheet.get_all_records()
        df = pd.DataFrame(data)

        df = rename_all_survey_columns(df=df)
        return df

    except Exception as e:
        print(f"Something went wrong with retrieving the survey data: {e}")
        return pd.DataFrame()


def format_checkbox_columns(checkbox_column: List[str]) -> Optional[str]:
    """
    This formats and returns the most common string in a column

    Args:
        checkbox_column (List[str]): The column that contains the checkbox columns - strings are seperated by commas.

    Returns:
        str: The most common choice in the column
    """

    formatted_strings = []

    for long_string in checkbox_column:
        seperated_strings = long_string.split(",")
        formatted_strings.extend(seperated_strings)

    if not formatted_strings:
        return None

    counter = Counter(formatted_strings)
    most_common_string, _ = counter.most_common(1)[0]

    return most_common_string


def format_number_columns(number_columns: List[str]) -> float:

    formatted_list = []

    for number in number_columns:
        if isinstance(number, str):
            if len(number) > 1:
                formatted_number = int(number[0])
                formatted_list.append(formatted_number)
            else:
                formatted_list.append(int(number))
        else:
            formatted_list.append(number)

    avg = np.mean(formatted_list)

    return round(avg, 2)
