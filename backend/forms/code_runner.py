import os
import sys

import django

# Add the parent directory to the Python path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()

from forms.db_management import TableManagement, DatabaseManagement, DatabaseBackup


def drop_table():
    t = TableManagement()
    t.drop_all_tables()
    print(t.get_table_name())

def add_demo_datas():
    d = DatabaseBackup()
    d.exist_data_loader("inter")
    d.insert_data_to_remote("inter")

    da = DatabaseManagement()
    da.add_course_data_to_sub("inter")

def backup_local():
    d = DatabaseBackup()
    d.local_backup()




if __name__ == "__main__":


    choice_handler = {1: drop_table,
                      2: add_demo_datas,
                      3: backup_local}

    text = (
            "1. Drop all tables.\n"
            "2. Add demo datas.\n"
            "3. Back up test.\n"
            )

    while True:
        print(text)
        choice = int(input())
        func = choice_handler.get(choice)
        func()
        break
