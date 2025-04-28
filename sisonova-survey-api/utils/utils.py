from collections import Counter
from typing import List, Optional


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
