"""This module use for get the course data from the university website."""

import requests
import pdfplumber
import os
import json
import re

from bs4 import BeautifulSoup
from datetime import datetime

DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sat', 'Sun']
NOT_COURSE_NAME = ['Pre', 'Thesis', 'Seminar', 'or']
FORBIDDEN_WORD = NOT_COURSE_NAME + DAYS
ROMAN_NUMBER = ['I', 'II', 'III', 'IV', 'V', 'VI']
RESULT_DATA = {}


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


def is_thai(text: str):
    """Checks if any character in the string is either numeric or thai"""
    return any(re.match("^[\u0E00-\u0E7F]*$", t) for t in text)


def is_subject_name(text: str):
    """
    The string is subject name if it passes these criteria
    1. Each character is not in thai and not a number
    2. string is not in upper case
    3. string is not in FORBIDDEN_WORD
    Remarks:
    If it is a roman number it passes.
    """
    if text in ROMAN_NUMBER:
        return True
    if any(is_thai(t) or t.isnumeric() for t in text):
        return False
    if text.isupper():
        return False
    if len(text) <= 1:
        return False
    return True


def has_num_and_alpha(text: str):
    """Check if the string has number and alphabet at the same time"""
    return any(t.isnumeric() for t in text) and any(t.isalpha() for t in text)


def is_valid_line(lines: list[str]):
    """
    Checks that the line is not gibberish and is either 
    a normal subject line. Ex. '01999011 -64 Food for Mankind 3 3 1 ...' or
    a subject name line. Ex. 'Sustainability'
    """
    first = lines[0]
    if is_thai(first):
        print('reject by thai')
        return False
    if len(first) < 2:
        print('reject by len')
        return False
    if has_num_and_alpha(first):
        print('reject by num and alpha')
        return False
    if first.isnumeric():
        if len(first) == 8:
            return True
        else:
            print('reject by not subject id')
            return False
    return True


def get_last_subject_id(fac: str):
    """Get the last added subject's id"""
    global RESULT_DATA
    return list(RESULT_DATA[fac].keys())[-1]


def handle_line(text: list[str], fac: str):
    """
    Handle each line and will either create a new subject in result_data or
    add to the previous subject's name
    """
    global RESULT_DATA
    print(text)
    first = text[0]
    if first in FORBIDDEN_WORD:
        print("reject by FORBIDDEN WORD")
        return
    if is_left_over_subject(first):
        subject_name = get_subject_name(text, 0)
        subject_id = get_last_subject_id(fac)
        RESULT_DATA[fac][subject_id] += ' ' + subject_name
        RESULT_DATA[fac][subject_id] = RESULT_DATA[fac][subject_id].strip()
        print('approve')
        return
    if not is_valid_line(text):
        reject.append(text)
        return
    subject_id = first
    if not is_subject_id(subject_id):
        return False
    subject_name = get_subject_name(text, 2)
    if subject_name in FORBIDDEN_WORD:
        print("reject by FORBIDDEN WORD")
        return
    if len(subject_name) == 0:
        print('reject by name len')
        reject.append(text)
        return
    print('approve')
    RESULT_DATA[fac][subject_id] = subject_name.strip()


def is_subject_id(text: str):
    if text.isnumeric() and len(text) == 8:
        return True
    return False


def is_left_over_subject(text: str):
    """Determine if the line is a leftover from subject name"""
    return all(t.isalpha() and not is_thai(t) and not t.isnumeric() for t in text)


def get_subject_name(text: list[str], index: int = 0):
    """
    Loop through the list of string 
    until the string fails is_subject_name() function
    """
    subject_name = []
    if len(text) <= index:
        return ''
    while is_subject_name(text[index]):
        subject_name += [text[index]]
        index += 1
        if index >= len(text):
            break
    return " ".join(subject_name)


def extract_text_from_pdf(pdf_path: str,
                          filename: str) -> None:
    """Extract text from the PDF using pdfplumber."""
    print(f"Start Extract Text From {filename}\n")
    global RESULT_DATA
    RESULT_DATA = {}
    with pdfplumber.open(pdf_path) as pdf:
        faculty = "undefined"
        RESULT_DATA[faculty] = {}
        # Loop PDF pages
        for page in pdf.pages:
            page_text = page.extract_text()  # Extract text from the page

            if not page_text:  # Check if the page contains text
                continue
            lines = page_text.split('\n')

            # Inner loop. Loop each line of the page.
            for line in lines:
                cur_line = line.split()

                if "คณะ" == cur_line[0][:3]:
                    faculty = cur_line[0]
                    try:
                        if RESULT_DATA[faculty]:
                            print(f"Continue Extract Data From"
                                  f" {filename}...\n")

                    except KeyError:
                        RESULT_DATA[faculty] = {}

                else:
                    handle_line(cur_line, faculty)
        print("Successfully Combined Data\n")


def save_to_json(data: dict[str, dict[str, str]],
                 filename: str, dir_name: str):
    """Save data as JSON."""
    with open(f'{dir_name}/{filename}', 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"Data saved to {dir_name}/{filename}")


def create_data():
    """Generate all data."""
    global RESULT_DATA
    pdf_urls = get_url()
    BASE_PATH = os.path.dirname(os.path.abspath(__file__))

    directory_path = BASE_PATH + "/database/scraped_data"

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
            extract_text_from_pdf(pdf_filename,
                                  set_filenames[index])

            # Save extracted text to a JSON file
            json_filename = f'{set_filenames[index]}.json'
            save_to_json(RESULT_DATA, json_filename, directory_path)

        finally:
            # Cleanup: Remove the downloaded PDF after processing
            if os.path.exists(pdf_filename):
                os.remove(pdf_filename)
            print(f"Cleaned up: {pdf_filename}\n")


reject = []
create_data()