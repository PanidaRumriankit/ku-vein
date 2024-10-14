import json

class DatabaseManagement:
    def __init__(self):
        self.data = None
        self.exist_data_loader()

    def exist_data_loader(self):
        """Combined all the data and separate by course programs."""
        with open("./database/inter2.json", "r", encoding="UTF-8") as file:
            inter2 = json.load(file)
        with open("./database/inter1.json", "r", encoding="UTF-8") as file:
            inter1 = json.load(file)

        all_faculty = {second: {} for second in inter2.keys()}
        first_term = {first: {} for first in inter1.keys()}
        all_faculty.update(first_term)

        for key, vals in inter2.items():
            all_faculty[key].update(vals)

        for key, vals in inter1.items():
            all_faculty[key].update(vals)

        self.data = all_faculty

    def insert_to_db_server(self):
        """Used for insert database to the database server."""
        pass



d = DatabaseManagement()
