import whois
from datetime import datetime, timezone

from tinylogging import new_event


def get_domain_age_days(domain: str) -> int | None:
    new_event("Getting Domain Age", "blue")
    try:
        w = whois.whois(domain)
        creation_date = w["creation_date"]

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date:
            age_days = (datetime.now(timezone.utc) - creation_date).days
            new_event("Done", "green")
            return age_days
        else:
            new_event("Could not get Domain Age", "red")
            return None
    except Exception:
        new_event("Error Getting Domain Age", "red")
        return None
