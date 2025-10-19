from bs4 import BeautifulSoup
import requests
import re

def clean_html_response(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style"]):
        tag.decompose()

    return str(soup)


if __name__ == "__main__":
    url = "https://www.standardbank.co.za/southafrica/business/products-and-services/bank-with-us/company-cards/our-cards/business-credit-card-form"
    response = requests.get(url)
    response.raise_for_status()  # optional: raise an error if the request failed
    html_content = response.text

    # Parse with BeautifulSoup
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Clean HTML
    clean_text = clean_html_response(soup)
    print(clean_text)