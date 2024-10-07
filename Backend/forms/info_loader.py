"""This module use for get the course data from the university website."""

import requests
from bs4 import BeautifulSoup
from datetime import datetime

# link change each year to make it uptodate
cur_year = datetime.now().year
url = f'https://registrar.ku.ac.th/class#{cur_year + 543}'

# Send a GET request
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the div with the class "spb_toggle_content"
    content_div = soup.find('div', class_='spb_toggle_content')

    # Find all 'a' tags within that div
    if content_div:

        links = content_div.find_all('a')  # Find all <a> tags

        url_container = []
        for link in links:
            href = link.get('href')  # Get the URL
            url_container.append(href)

        print(url_container)
    else:
        print("Content div not found.")
else:
    print(f"Failed to retrieve page. Status code: {response.status_code}")
