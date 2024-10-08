"""This module use for get the course data from the university website."""

import requests
import pdfplumber
import os
import json

from bs4 import BeautifulSoup
from datetime import datetime


def get_url() -> list[str]:
    """GET all the course data url."""
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

            print(f"List of URL: {url_container}")
            return url_container

        else:
            print("Content div not found.")
    else:
        print(f"Failed to retrieve page. Status code: {response.status_code}")


def download_pdf(url: str, filename: str):
    """Download PDF files."""
    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"{filename} downloaded successfully\n")
    else:
        print(f"Failed to download {filename}\n")


def extract_text_from_pdf(pdf_path: str,
                          filename: str) -> dict[str, dict[str, str]]:
    """Extract text from the PDF using pdfplumber."""
    print(f"Start Extract Text From {filename}\n")
    with pdfplumber.open(pdf_path) as pdf:
        faculty = ""
        result_data = {}

        # Loop PDF pages
        for page in pdf.pages:
            page_text = page.extract_text()  # Extract text from the page

            if page_text:  # Check if the page contains text
                lines = page_text.split('\n')

                # Inner loop. Loop each line of the page.
                for line in lines:
                    cur_line = line.split()

                    if "คณะ" == cur_line[0][:3]:
                        faculty = cur_line[0]
                        try:
                            if result_data[faculty]:
                                print(f"Continue Extract Data From"
                                      f" {filename}...\n")

                        except KeyError:
                            result_data[faculty] = {}

                    # This code might need to update to 02 in the future.
                    # However, I hope the teacher will
                    # change data from pdf into html

                    elif cur_line[0][:2] == "01" and faculty:
                        # Filtering criteria for each line
                        for i in range(len(cur_line)):
                            # In line element loop
                            if cur_line[i][0].isnumeric() and \
                                    i not in [0, 1] and len(cur_line[0]) >= 3:
                                # Check when the name of the course end

                                course_id = cur_line[:1][0]
                                course_name = " ".join(cur_line[2:i])

                                if "Thesis" not in course_name.split() \
                                        and "Seminar" != course_name \
                                        and "(ต่อ)" != course_name:

                                    # Seriously
                                    # Flake8?
                                    result_data[faculty][
                                        course_id
                                    ] = course_name

                                break

        print("Successfully Combined Data\n")
        return result_data  # Return the filtered text


def save_to_json(data: dict[str, dict[str, str]],
                 filename: str, dir_name: str):
    """Save data as JSON."""
    with open(f'{dir_name}/{filename}', 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"Data saved to {dir_name}/{filename}")


def create_data():
    """Generate all data."""
    pdf_urls = get_url()
    directory_path = "./database"

    # Loop through each PDF URL, download, and extract text
    set_filenames = ["normal2", "special2",
                     "inter2", "normal1", "special1", "inter1"]
    if len(pdf_urls) == 3:
        set_filenames = set_filenames[3:]

    for index, url in enumerate(pdf_urls):
        try:
            # Extract the filename from the URL (last part after the slash)
            pdf_filename = url.split('/')[-1]

            # Download the PDF file
            download_pdf(url, pdf_filename)

            # Extract text from the PDF
            extracted_text = extract_text_from_pdf(pdf_filename,
                                                   set_filenames[index])

            # Save extracted text to a JSON file
            json_filename = f'{set_filenames[index]}.json'
            save_to_json(extracted_text, json_filename, directory_path)

        finally:
            # Cleanup: Remove the downloaded PDF after processing
            if os.path.exists(pdf_filename):
                os.remove(pdf_filename)
            print(f"Cleaned up: {pdf_filename}")
