import os
import sys
import django


# Add the parent directory to the Python path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()

from forms.db_query import InterQuery
from forms.db_management import TableManagement, DatabaseManagement, DatabaseBackup

if __name__ == "__main__":
    t = TableManagement()
    t.drop_all_tables()

    # After migrate uncomment this
    # d = DatabaseBackup()
    # d.exist_data_loader()
    # d.insert_data_to_remote()
    #
    # da = DatabaseManagement()
    # da.add_course_data_to_sub("inter")


