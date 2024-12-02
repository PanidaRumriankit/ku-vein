## Installation guide for backend

1. Make sure you are at `/backend` directory then run this command to install 
all the requirements from requirements.txt
    ```shell
    pip install -r requirements.txt
    ```
2. Make a `.env` file inside backend directory.
Examples of the .env files are in [sample.env](./sample.env)

3. Migrate the data to initialize Aiven database
    ```shell
    python manage.py migrate
    ```
4. Go back to the previous directory using
    ```shell
    cd ..
    ```
   Read the [installation guide](../README.md) after the backend section