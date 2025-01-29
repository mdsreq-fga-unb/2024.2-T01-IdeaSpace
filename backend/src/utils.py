from unidecode import unidecode

def get_slug(name: str) -> str:
    name = unidecode(name)
    return name.lower().replace(" ", "_")
