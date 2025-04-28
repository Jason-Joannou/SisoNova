from typing import Optional

import numpy as np
import pandas as pd

from utils.gs_client import load_gs_client
from utils.utils import format_checkbox_columns

# The idea is to build a story line for each of the sections in the survey
# So whats the storyline
# Ie this is our average male user
# on average he supports x
# on average he struggles with y
# Then we conclude our findings at the end


def get_gender_demographic_statistics(df: pd.DataFrame, gender: Optional[str] = None):
    """
    Gets the statistics of all the survey participants

    Args:
        df (pd.DataFrame): A dataframe containing the demographic information.
        gender (Optional[str]): A string of the type of gender to filter the dataframe by

    Returns:
        dict: Male statistics
    """
    new_df = df.copy()
    if gender:
        new_df = df[df["GENDER"] == gender].copy()

    stats = {}

    number_of_participants = len(new_df)
    # Demographics

    stats["most_frequent_age_group"] = (
        new_df["AGE_GROUP"].mode()[0] if not new_df["AGE_GROUP"].empty else "No data"
    )
    stats["most_frequent_province"] = (
        new_df["PROVINCE"].mode()[0] if not new_df["PROVINCE"].empty else "No data"
    )
    stats["most_frequent_living_location"] = (
        new_df["AREA_TYPE"].mode()[0] if not new_df["AREA_TYPE"].empty else "No data"
    )
    stats["most_frequent_employment_status"] = (
        new_df["EMPLOYMENT_STATUS"].mode()[0]
        if not new_df["EMPLOYMENT_STATUS"].empty
        else "No data"
    )
    stats["most_frequent_education_level"] = (
        new_df["EDUCATION_LEVEL"].mode()[0]
        if not new_df["EDUCATION_LEVEL"].empty
        else "No data"
    )

    # Personal and household income

    stats["most_frequent_personal_income"] = (
        new_df["MONTHLY_PERSONAL_INCOME"].mode()[0]
        if not new_df["MONTHLY_PERSONAL_INCOME"].empty
        else "No data"
    )
    stats["most_frequent_household_income"] = (
        new_df["MONTHLY_HOUSEHOLD_INCOME"].mode()[0]
        if not new_df["MONTHLY_HOUSEHOLD_INCOME"].empty
        else "No data"
    )
    stats["most_frequent_source_of_income"] = (
        new_df["INCOME_SOURCE"].mode()[0]
        if not new_df["INCOME_SOURCE"].empty
        else "No data"
    )

    people_in_household_list = new_df["HOUSEHOLD_SIZE"].to_list()
    formatted_people_in_household_list = []

    for number in people_in_household_list:
        if len(number) > 1:
            formatted_number = int(number[0])
            formatted_people_in_household_list.append(formatted_number)
        else:
            formatted_people_in_household_list.append(int(number))

    stats["average_household_size"] = np.mean(formatted_people_in_household_list)

    earn_income_in_household = new_df["INCOME_EARNERS_COUNT"].to_list()
    formatted_earn_income_in_household = []

    for number in earn_income_in_household:
        if len(number) > 1:
            formatted_number = int(number)
            formatted_earn_income_in_household.append(formatted_number)
        else:
            formatted_earn_income_in_household.append(int(number))

    stats["average_income_earners"] = np.mean(formatted_earn_income_in_household)

    # Income Management

    stats["most_frequent_spending_plan_frequency"] = (
        new_df["SPENDING_PLAN_FREQUENCY"].mode()[0]
        if not new_df["SPENDING_PLAN_FREQUENCY"].empty
        else "No data"
    )
    stats["most_frequent_spending_plan_timing"] = (
        new_df["SPENDING_PLAN_TIMING"].mode()[0]
        if not new_df["SPENDING_PLAN_TIMING"].empty
        else "No data"
    )
    stats["most_frequent_budgeting_style"] = (
        new_df["BUDGETING_STYLE"].mode()[0]
        if not new_df["BUDGETING_STYLE"].empty
        else "No data"
    )
    stats["most_frequent_expense_tracking"] = (
        new_df["EXPENSE_TRACKING"].mode()[0]
        if not new_df["EXPENSE_TRACKING"].empty
        else "No data"
    )
    stats["most_frequent_spending_management_tool"] = format_checkbox_columns(
        new_df["SPENDING_MANAGEMENT_TOOLS"].to_list()
    )
    stats["most_frequent_financial_control"] = (
        new_df["FINANCIAL_CONTROL_FREQUENCY"].mode()[0]
        if not new_df["FINANCIAL_CONTROL_FREQUENCY"].empty
        else "No data"
    )
    stats["most_frequent_money_emotion"] = (
        new_df["MONEY_EMOTION"].mode()[0]
        if not new_df["MONEY_EMOTION"].empty
        else "No data"
    )
    stats["most_frequent_income_adequacy"] = (
        new_df["INCOME_ADEQUACY"].mode()[0]
        if not new_df["INCOME_ADEQUACY"].empty
        else "No data"
    )
    stats["most_frequent_cash_shortage_strategy"] = format_checkbox_columns(
        new_df["CASH_SHORTAGE_STRATEGIES"].to_list()
    )
    stats["most_frequent_payment_delay"] = (
        new_df["PAYMENT_DELAY_FREQUENCY"].mode()[0]
        if not new_df["PAYMENT_DELAY_FREQUENCY"].empty
        else "No data"
    )
    stats["most_frequent_monthly_surplus"] = (
        new_df["MONTHLY_SURPLUS"].mode()[0]
        if not new_df["MONTHLY_SURPLUS"].empty
        else "No data"
    )
    stats["most_frequent_spending_priority"] = (
        new_df["SPENDING_PRIORITY_METHOD"].mode()[0]
        if not new_df["SPENDING_PRIORITY_METHOD"].empty
        else "No data"
    )
    stats["most_frequent_financial_decision_factor"] = (
        new_df["FINANCIAL_DECISION_FACTORS"].mode()[0]
        if not new_df["FINANCIAL_DECISION_FACTORS"].empty
        else "No data"
    )
    stats["most_frequent_purchase_regret"] = (
        new_df["PURCHASE_REGRET_FREQUENCY"].mode()[0]
        if not new_df["PURCHASE_REGRET_FREQUENCY"].empty
        else "No data"
    )

    # Financial Access

    stats["most_frequent_account_type"] = format_checkbox_columns(
        new_df["ACCOUNT_TYPES"].to_list()
    )
    stats["most_frequent_active_accounts_count"] = (
        new_df["ACTIVE_ACCOUNTS_COUNT"].mode()[0]
        if not new_df["ACTIVE_ACCOUNTS_COUNT"].empty
        else "No data"
    )
    stats["most_frequent_multiple_accounts_reason"] = format_checkbox_columns(
        new_df["MULTIPLE_ACCOUNTS_REASONS"].to_list()
    )
    stats["most_frequent_account_usage_purpose"] = format_checkbox_columns(
        new_df["ACCOUNT_USAGE_PURPOSES"].to_list()
    )
    stats["most_frequent_trusted_financial_service"] = format_checkbox_columns(
        new_df["TRUSTED_FINANCIAL_SERVICES"].to_list()
    )
    stats["most_frequent_provider_switching"] = (
        new_df["PROVIDER_SWITCHING_HISTORY"].mode()[0]
        if not new_df["PROVIDER_SWITCHING_HISTORY"].empty
        else "No data"
    )
    stats["most_frequent_financial_service"] = format_checkbox_columns(
        new_df["MOST_USED_FINANCIAL_SERVICES"].to_list()
    )
    stats["most_frequent_financial_service_issue"] = format_checkbox_columns(
        new_df["FINANCIAL_SERVICE_ISSUES"].to_list()
    )
    stats["most_frequent_digital_banking_usage"] = (
        new_df["DIGITAL_BANKING_FREQUENCY"].mode()[0]
        if not new_df["DIGITAL_BANKING_FREQUENCY"].empty
        else "No data"
    )
    stats["most_frequent_financial_inclusion_perception"] = (
        new_df["FINANCIAL_INCLUSION_PERCEPTION"].mode()[0]
        if not new_df["FINANCIAL_INCLUSION_PERCEPTION"].empty
        else "No data"
    )

    # Financial Barriers

    stats["most_frequent_paperwork_avoidance"] = (
        new_df["PAPERWORK_AVOIDANCE"].mode()[0]
        if not new_df["PAPERWORK_AVOIDANCE"].empty
        else "No data"
    )
    stats["most_frequent_financial_literacy"] = (
        new_df["FINANCIAL_LITERACY_LEVEL"].mode()[0]
        if not new_df["FINANCIAL_LITERACY_LEVEL"].empty
        else "No data"
    )
    stats["most_frequent_documentation_barrier"] = (
        new_df["DOCUMENTATION_BARRIERS"].mode()[0]
        if not new_df["DOCUMENTATION_BARRIERS"].empty
        else "No data"
    )
    stats["most_frequent_financial_service_concern"] = format_checkbox_columns(
        new_df["FINANCIAL_SERVICE_CONCERNS"].to_list()
    )
    stats["most_frequent_financial_confidence"] = (
        new_df["FINANCIAL_CONFIDENCE"].mode()[0]
        if not new_df["FINANCIAL_CONFIDENCE"].empty
        else "No data"
    )
    stats["most_frequent_financial_confusion_response"] = (
        new_df["FINANCIAL_CONFUSION_RESPONSE"].mode()[0]
        if not new_df["FINANCIAL_CONFUSION_RESPONSE"].empty
        else "No data"
    )
    stats["most_frequent_financial_institution_trust"] = (
        new_df["FINANCIAL_INSTITUTION_TRUST"].mode()[0]
        if not new_df["FINANCIAL_INSTITUTION_TRUST"].empty
        else "No data"
    )
    stats["most_frequent_negative_financial_experience"] = (
        new_df["NEGATIVE_FINANCIAL_EXPERIENCES"].mode()[0]
        if not new_df["NEGATIVE_FINANCIAL_EXPERIENCES"].empty
        else "No data"
    )
    stats["most_frequent_financial_exclusion_feeling"] = (
        new_df["FINANCIAL_EXCLUSION_FEELING"].mode()[0]
        if not new_df["FINANCIAL_EXCLUSION_FEELING"].empty
        else "No data"
    )
    stats["most_frequent_clarity_impact"] = (
        new_df["CLARITY_IMPACT_ON_USAGE"].mode()[0]
        if not new_df["CLARITY_IMPACT_ON_USAGE"].empty
        else "No data"
    )

    # Psychological Barriers

    stats["most_frequent_financial_risk_tolerance"] = (
        new_df["FINANCIAL_RISK_TOLERANCE"].mode()[0]
        if not new_df["FINANCIAL_RISK_TOLERANCE"].empty
        else "No data"
    )
    stats["most_frequent_debt_attitude"] = (
        new_df["DEBT_ATTITUDE"].mode()[0]
        if not new_df["DEBT_ATTITUDE"].empty
        else "No data"
    )
    stats["most_frequent_debt_perception"] = (
        new_df["DEBT_PERCEPTION"].mode()[0]
        if not new_df["DEBT_PERCEPTION"].empty
        else "No data"
    )
    stats["most_frequent_borrowing_comfort"] = (
        new_df["BORROWING_COMFORT"].mode()[0]
        if not new_df["BORROWING_COMFORT"].empty
        else "No data"
    )
    stats["most_frequent_saving_perception"] = format_checkbox_columns(
        new_df["SAVING_PERCEPTION"].to_list()
    )
    stats["most_frequent_saving_possibility_belief"] = (
        new_df["SAVING_POSSIBILITY_BELIEF"].mode()[0]
        if not new_df["SAVING_POSSIBILITY_BELIEF"].empty
        else "No data"
    )
    stats["most_frequent_windfall_usage"] = (
        new_df["WINDFALL_USAGE"].mode()[0]
        if not new_df["WINDFALL_USAGE"].empty
        else "No data"
    )
    stats["most_frequent_saving_benefit_belief"] = (
        new_df["SAVING_BENEFIT_BELIEF"].mode()[0]
        if not new_df["SAVING_BENEFIT_BELIEF"].empty
        else "No data"
    )
    stats["most_frequent_purchase_decision_criteria"] = (
        new_df["PURCHASE_DECISION_CRITERIA"].mode()[0]
        if not new_df["PURCHASE_DECISION_CRITERIA"].empty
        else "No data"
    )

    # Technology Understanding

    stats["most_frequent_fintech_comfort_level"] = (
        new_df["FINTECH_COMFORT_LEVEL"].mode()[0]
        if not new_df["FINTECH_COMFORT_LEVEL"].empty
        else "No data"
    )
    stats["most_frequent_financial_management_device"] = format_checkbox_columns(
        new_df["FINANCIAL_MANAGEMENT_DEVICES"].to_list()
    )
    stats["most_frequent_internet_usage"] = (
        new_df["INTERNET_USAGE_FREQUENCY"].mode()[0]
        if not new_df["INTERNET_USAGE_FREQUENCY"].empty
        else "No data"
    )
    stats["most_frequent_digital_finance_challenge"] = (
        new_df["DIGITAL_FINANCE_CHALLENGES"].mode()[0]
        if not new_df["DIGITAL_FINANCE_CHALLENGES"].empty
        else "No data"
    )
    stats["most_frequent_app_abandonment"] = (
        new_df["APP_ABANDONMENT_EXPERIENCE"].mode()[0]
        if not new_df["APP_ABANDONMENT_EXPERIENCE"].empty
        else "No data"
    )
    stats["most_frequent_fintech_learning_preference"] = (
        new_df["FINTECH_LEARNING_PREFERENCE"].mode()[0]
        if not new_df["FINTECH_LEARNING_PREFERENCE"].empty
        else "No data"
    )
    stats["most_frequent_fintech_adoption_motivator"] = format_checkbox_columns(
        new_df["FINTECH_ADOPTION_MOTIVATORS"].to_list()
    )
    stats["most_frequent_digital_security_trust"] = (
        new_df["DIGITAL_SECURITY_TRUST"].mode()[0]
        if not new_df["DIGITAL_SECURITY_TRUST"].empty
        else "No data"
    )
    stats["most_frequent_digital_error_anxiety"] = (
        new_df["DIGITAL_ERROR_ANXIETY"].mode()[0]
        if not new_df["DIGITAL_ERROR_ANXIETY"].empty
        else "No data"
    )
    stats["most_frequent_financial_app_used"] = format_checkbox_columns(
        new_df["FINANCIAL_APPS_USED"].to_list()
    )

    return stats
