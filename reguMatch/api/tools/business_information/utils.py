from models import BusinessProfile


def get_dummy_user_details() -> BusinessProfile:
    """Dummy method to retrieve a test Business Profile"""

    return BusinessProfile(
        company_name="SisoNova",
        trading_name="SisoNova",
        country="South Africa",
        province="Gauteng",
        city="Johannesburg",
        industry="Technology",
    )
