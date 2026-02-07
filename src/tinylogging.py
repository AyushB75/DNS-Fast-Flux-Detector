from datetime import datetime

colors = {
    "red": "\033[91m",
    "green": "\033[92m",
    "yellow": "\033[93m",
    "blue": "\033[94m",
    "magenta": "\033[95m",
    "cyan": "\033[96m",
    "white": "\033[97m"
}

def new_event(event: str, color: str = None):
    color_code = colors.get(color, "")
    reset_code = "\033[0m" if color else ""

    print(f"{color_code}[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {event}{reset_code}")


def decorated_println(string: str, color: str):
    color_code = colors.get(color, "")
    reset_code = "\033[0m" if color else ""

    print(f"{color_code}{string}{reset_code}")

