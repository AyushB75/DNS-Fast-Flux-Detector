import pyfiglet
from shutil import get_terminal_size

def print_banner(text, font):
    # Get terminal width
    width = get_terminal_size().columns

    # Generate ASCII art
    ascii_art = pyfiglet.figlet_format(text, font=font)

    # Center each line
    for line in ascii_art.splitlines():
        print(line.ljust(width))

