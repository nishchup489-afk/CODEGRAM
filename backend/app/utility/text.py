def slugify(value: str) -> str:
    """Return a lowercase, hyphen-separated identifier for human text."""
    cleaned: list[str] = []
    previous_dash = False
    for character in value.lower().strip():
        if character.isalnum():
            cleaned.append(character)
            previous_dash = False
        elif character in {" ", "-", "_"} and not previous_dash:
            cleaned.append("-")
            previous_dash = True
    return "".join(cleaned).strip("-")
