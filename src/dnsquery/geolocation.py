from geoip2.database import Reader
from pathlib import Path
from tinylogging import new_event

CONFIG_PATH = Path(__file__).parent.parent / "config"


def get_asn(ip: str) -> int | None:
    ASN_DB = Reader(CONFIG_PATH / "GeoLite2-ASN.mmdb")

    new_event(f"Extracting ASN for {ip}", "blue")
    try:
        response = ASN_DB.asn(ip)
        new_event("Done\n", "green")
        return response.autonomous_system_number
    except:
        new_event("Error Extracting ASN\n", "red")
        return None

def get_country(ip: str) -> str | None:
    COUNTRY_DB = Reader(CONFIG_PATH / "GeoLite2-Country.mmdb")

    new_event(f"Extracting Country for {ip}", "blue")
    try:
        response = COUNTRY_DB.country(ip)
        new_event("Done\n", "green")
        return response.country.iso_code
    except:
        new_event("Error Extracting Country\n", "red")
        return None


