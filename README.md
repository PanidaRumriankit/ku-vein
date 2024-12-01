# ku-vein

[![Django CI](https://github.com/PanidaRumriankit/ku-vein/actions/workflows/django_test.yml/badge.svg)](https://github.com/PanidaRumriankit/ku-vein/actions/workflows/django_test.yml)
[![Coverage](https://github.com/PanidaRumriankit/ku-vein/actions/workflows/coverage.yml/badge.svg)](https://github.com/PanidaRumriankit/ku-vein/actions/workflows/coverage.yml)
[![Flake8](https://github.com/PanidaRumriankit/ku-vein/actions/workflows/flake8_docstring.yml/badge.svg)](https://github.com/PanidaRumriankit/ku-vein/actions/workflows/flake8_docstring.yml)

## Information
You can find information  @[information hub](../../wiki)

## Installation guide
prerequisite
 - python 3.11 or newer
 - node.js

1. Clone the repository
    ```shell 
    git clone https://github.com/PanidaRumriankit/ku-vein.git`
    ```
2. Creating virtual environment
   - For macOS/Linux
   ```
   python -m venv env
   ```
   
   - For Windows
   ```
   python3 -m venv env
   ```
3. Activate virtual environment
   - For macOS/Linux
    ```shell
    source env/bin/activate
    ```
   - For Windows
    ```shell
    env\Scripts\activate
    ```
4. Install all requirements for frontend
    ```shell
    cd frontend
    ```
    
   - [frontend installation guide](./frontend/README.md)
5. Install all requirements for backend
    ```shell
    cd backend
    ```
   - [backend installation guide](./backend/README.md)

## Run
Make sure you have two separate terminal to run both backend and frontend
   - First terminal for backend
       ```shell
       cd backend
       python manage.py runserver
       ```
   - Second terminal for frontend
      ```shell
      cd frontend
      npm run dev
      ```
The first and second terminal is not fixed. You can run frontend and backend in any terminal.