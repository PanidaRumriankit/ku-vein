import os
import sys
import django


# Add the parent directory to the Python path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kuvein.settings')

django.setup()

from forms.models import UserData
from forms.db_query import InterQuery

if __name__ == "__main__":
    print(UserData.objects.all().values(
        'email'
    ))
