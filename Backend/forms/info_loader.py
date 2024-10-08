"""This module use for get the course data from the university website."""

import requests
import pdfplumber
import os
import json

from bs4 import BeautifulSoup
from datetime import datetime

def get_url():
    """GET all the course data url"""

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


def download_pdf(url, filename):
    """Function to download PDF files."""

    response = requests.get(url)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"{filename} downloaded successfully\n")
    else:
        print(f"Failed to download {filename}\n")


def extract_text_from_pdf(pdf_path, filename):
    """Function to extract text from the PDF using pdfplumber."""
    print(f"Start Extract Text From {filename}\n")
    with pdfplumber.open(pdf_path) as pdf:
        faculty = ""
        result_data = {}

        # Loop PDF pages
        for page in pdf.pages:
            page_text = page.extract_text()  # Extract text from the page

            if page_text:  # Check if the page contains text
                lines = page_text.split('\n')  # Split the page text into individual lines

                # Inner loop. Loop each line of the page.
                for line in lines:
                    cur_line = line.split()

                    if "คณะ" == cur_line[0][:3]:
                        faculty = cur_line[0]
                        try:
                            if result_data[faculty]:
                                print(f"Continue Extract Data From {filename}...\n")

                        except KeyError:
                            result_data[faculty] = {}

                    # This code might need to update to 02 in the future.
                    # However, I hope the teacher will change data from pdf into html

                    elif cur_line[0][:2] == "01" and faculty:
                        # Filtering criteria for each line
                        for i in range(len(cur_line)):
                            # In line element loop
                            if cur_line[i][0].isnumeric() and i not in [0, 1] and len(cur_line[0]) >= 3:
                                # Check when the name of the course end

                                course_id = cur_line[:1][0] # Add the filtered line to the final text
                                course_name = " ".join(cur_line[2:i])

                                if not "Thesis" in course_name.split() and "Seminar" != course_name \
                                        and "(ต่อ)" != course_name:
                                    result_data[faculty][course_id] = course_name

                                break

        print("Successfully Combined Data\n")
        return result_data  # Return the filtered text


def save_to_json(data, filename, dir_name):
    """Function to save data as JSON."""

    with open(f'{dir_name}/{filename}', 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
    print(f"Data saved to {dir_name}/{filename}")

def create_data():
    """Function to combine all function in this module."""
    pdf_urls = get_url()
    directory_path = "./database"

    # Loop through each PDF URL, download, and extract text
    set_filename1 = ["normal2", "special2", "inter2", "normal1", "special1", "inter1"]
    set_filename2 = ["normal1", "special1", "inter1"]

    if len(pdf_urls) == 6:
        set_filename = set_filename1
    else:
        set_filename = set_filename2

    index = 0

    for url in pdf_urls:
        # Extract the filename from the URL (last part after the slash)
        name_of_the_file = url.split('/')[-1]

        # Download the PDF file
        download_pdf(url, name_of_the_file)

        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(name_of_the_file, set_filename[index])

        # Save all extracted PDF data to a JSON file
        save_to_json(extracted_text, f'{set_filename[index]}.json', directory_path)

        # Store the extracted text in a dictionary
        index += 1

        # Cleanup: Remove the downloaded PDF after processing
        os.remove(name_of_the_file)



create_data()