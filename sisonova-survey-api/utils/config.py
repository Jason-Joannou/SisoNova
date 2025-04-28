DEMOGRAPHIC_COLUMNS = {
    "What age group do you belong to?": "AGE_GROUP",
    "What is your gender?": "GENDER",
    "Which province do you currently live in?": "PROVINCE",
    "How would you best describe the area you live?": "AREA_TYPE",  # Changed from LOCATION
    "What is your current employment status?": "EMPLOYMENT_STATUS",
    "What is your highest level of education completed?": "EDUCATION_LEVEL",  # Changed from EDUCATION_COMPLETED
}

PERSONAL_AND_HOUSEHOLD_INCOME_COLUMNS = {
    "What is your average personal monthly income?": "MONTHLY_PERSONAL_INCOME",  # Changed from PERSONAL_INCOME
    "What is your primary source of income?": "INCOME_SOURCE",  # Changed from SOURCE_OF_INCOME
    "Including yourself, how many people live in your household?": "HOUSEHOLD_SIZE",  # Changed from PEOPLE_IN_HOUSEHOLD
    "Including yourself, how many people earn an income in your household?": "INCOME_EARNERS_COUNT",  # Changed from EARN_INCOME_IN_HOUSEHOLD
    "What is your average household monthly income?": "MONTHLY_HOUSEHOLD_INCOME",  # Changed from HOUSEHOLD_INCOME
}

INCOME_MANAGEMENT_COLUMNS = {
    "How often do you plan your spending?": "SPENDING_PLAN_FREQUENCY",  # Changed from PLAN_SPENDING
    "Do you plan your spending before or after getting paid?": "SPENDING_PLAN_TIMING",  # Changed from WHEN_PLAN_SPENDING
    "How would you describe the way you budget your money?": "BUDGETING_STYLE",  # Changed from BUDGET_DESCRIPTION
    "Do you keep an eye on where your money goes?": "EXPENSE_TRACKING",  # Changed from TRACK_MONEY
    "What helps you manage your spending? (You can choose more than one)": "SPENDING_MANAGEMENT_TOOLS",  # Changed from MANAGE_SPENDING
    "How often do you feel like you're in control of your money?": "FINANCIAL_CONTROL_FREQUENCY",  # Changed from MONEY_CONTROL
    "How do you usually feel when you think about your money?": "MONEY_EMOTION",  # Changed from MONEY_FEELING
    "Does your income cover your needs and help you reach your goals?": "INCOME_ADEQUACY",  # Changed from INCOME_COVER_NEEDS
    "If you run out of money before month-end, what do you usually do? (Choose all that apply)": "CASH_SHORTAGE_STRATEGIES",  # Changed from MONTH_END_RUN_OUT
    "How often do you have to delay or skip paying for important things (like rent, transport, or school fees)?": "PAYMENT_DELAY_FREQUENCY",  # Changed from DELAY_PAYMENTS
    "Do you usually have extra money at the end of the month?": "MONTHLY_SURPLUS",  # Changed from EXTRA_MONEY
    "How do you decide what to spend money on first when you get paid?": "SPENDING_PRIORITY_METHOD",  # Changed from SPENDING_FIRST
    "What matters most to you when making a financial decision, like buying something big or lending money?": "FINANCIAL_DECISION_FACTORS",  # Changed from FINANCIAL_DECISION
    "How often do you feel guilty or regret buying something?": "PURCHASE_REGRET_FREQUENCY",  # Changed from PURCHASE_GUILT
}

FINANCIAL_ACCESS_COLUMNS = {
    "Do you have accounts with any of the following? (Select all that apply)": "ACCOUNT_TYPES",  # Changed from BANK_ACCOUNTS
    "How many different bank accounts or money-related accounts do you use regularly?": "ACTIVE_ACCOUNTS_COUNT",  # Changed from NUMBER_OF_ACCOUNTS
    "If you do have more than one account, why did you open them? (Select all that apply)": "MULTIPLE_ACCOUNTS_REASONS",  # Changed from REASON_FOR_MULTIPLE_ACCOUNTS
    "If you have more than one account, what do you use your different accounts for? (Select all that apply)": "ACCOUNT_USAGE_PURPOSES",  # Changed from MULTIPLE_ACCOUNT_USES
    "Which of the following do you trust most to keep your money safe? (Select all that apply)": "TRUSTED_FINANCIAL_SERVICES",  # Changed from FINANCIAL_SERVICES_TRUST
    "Have you ever changed your bank or money service provider?": "PROVIDER_SWITCHING_HISTORY",  # Changed from CHANGED_ACCOUNTS
    "Which services do you use the most with your bank or money provider? (Select all that apply)": "MOST_USED_FINANCIAL_SERVICES",  # Changed from FREQUENTLY_USED_FINANCIAL_SERVICES
    "Have you had any of these problems when using your bank or money provider? (Select all that apply)": "FINANCIAL_SERVICE_ISSUES",  # Changed from FINANCIAL_SERVICE_PROBLEMS
    "How often do you use mobile banking or financial apps (e.g., Capitec App, FNB App)?": "DIGITAL_BANKING_FREQUENCY",  # Changed from FINANCIAL_SERVICES_USAGE
    "Do you think banks and money services are made for people like you?": "FINANCIAL_INCLUSION_PERCEPTION",  # Changed from FINANCIAL_SERVICES_MADE_FOR_YOU
}

FINANCIAL_BARRIERS_COLUMNS = {
    "Have you ever avoided getting a bank account, insurance, or loan because the paperwork was too confusing?": "PAPERWORK_AVOIDANCE",
    "Is it easy for you to understand the papers and rules from banks and other money businesses?": "FINANCIAL_LITERACY_LEVEL",
    "Have you ever been asked to give documents (like your ID, proof of where you live, or payslip) and couldn’t?": "DOCUMENTATION_BARRIERS",
    "When you think about using something new from the bank (like a loan or insurance), what worries you the most? (Select all that apply)": "FINANCIAL_SERVICE_CONCERNS",
    "How sure are you that you can manage your money well?": "FINANCIAL_CONFIDENCE",
    "If you don’t understand something about a bank or money service, what do you usually do?": "FINANCIAL_CONFUSION_RESPONSE",
    "Do you trust banks and other money services to treat you fairly and honestly?": "FINANCIAL_INSTITUTION_TRUST",
    "Have you ever had a bad experience with a bank or money service that made you not want to use them again?": "NEGATIVE_FINANCIAL_EXPERIENCES",
    "Do you ever feel like banks or money services are not made for people in your situation or community?": "FINANCIAL_EXCLUSION_FEELING",
    "If banks and money services were explained more clearly and simply, would you be more likely to use them?": "CLARITY_IMPACT_ON_USAGE",
}

PSYCHOLOGICAL_BARRIERS_COLUMNS = {
    "How comfortable are you with taking risks with your money (for example, investing in something that could make you more money, but also could lose money)?": "FINANCIAL_RISK_TOLERANCE",
    "Do you think taking on debt (like a loan) can be a good idea if you can manage it well?": "DEBT_ATTITUDE",
    "What is your first thought when you hear the word “debt”?": "DEBT_PERCEPTION",
    "If you needed money quickly, how would you feel about borrowing it (from a bank, family, or friends)?": "BORROWING_COMFORT",
    "What does saving money mean to you? (Select all that apply)": "SAVING_PERCEPTION",
    "Do you think it’s possible to save money even if you don’t have a lot of money or your income changes often?": "SAVING_POSSIBILITY_BELIEF",
    "When you get extra income (like a bonus, gift, or side job), what do you usually do first?": "WINDFALL_USAGE",
    "Do you think saving money pays off in the long run?": "SAVING_BENEFIT_BELIEF",
    "How do you decide if something is worth buying?": "PURCHASE_DECISION_CRITERIA",
}

TECHNOLOGY_UNDERSTANDING_COLUMNS = {
    "How comfortable are you with using technology for money tasks (like sending money, checking your balance, or signing up for services)?": "FINTECH_COMFORT_LEVEL",
    "Which of these devices do you use to manage your money? (Select all that apply)": "FINANCIAL_MANAGEMENT_DEVICES",
    "How often do you access the internet (on any device)?": "INTERNET_USAGE_FREQUENCY",
    "What’s the biggest problem you face when using digital tools for managing money (like apps, websites, or mobile money)?": "DIGITAL_FINANCE_CHALLENGES",
    "Have you ever stopped using a financial app or service because it was hard to understand or use?": "APP_ABANDONMENT_EXPERIENCE",
    "If you needed to learn how to use a new financial app, how would you like to learn?": "FINTECH_LEARNING_PREFERENCE",
    "What would encourage you to try a new financial app or tool? (Select all that apply)": "FINTECH_ADOPTION_MOTIVATORS",
    "How much do you trust online platforms to keep your personal and financial information secure?": "DIGITAL_SECURITY_TRUST",
    "Do you ever avoid using digital tools for money because you're worried you might make a mistake (like sending money to the wrong person)?": "DIGITAL_ERROR_ANXIETY",
    "Which digital tools or apps do you use to manage your money? (Select all that apply)": "FINANCIAL_APPS_USED",
}
