import argparse
from tui import print_banner
from Rx.core import get_score
from tinylogging import new_event, decorated_println

argsparse = argparse.ArgumentParser()

argsparse.add_argument("-d", "--domain", type=str, required=True)
args = argsparse.parse_args()

domain = args.domain

print_banner("Fast Flux Detector",  "big")

#
# with open("config/whitelist.txt") as f:
#     WHITELIST = set(line.strip().lower() for line in f if line.strip())
#
#
# def is_whitelisted(domain):
#     parts = domain.split(".")
#     return ".".join(parts[-2:])
#
#
#
# new_event(f"Checking if {domain} is in whitelist.txt", "blue")
#
# if is_whitelisted(domain.lower()) in WHITELIST:
#     decorated_println(f"{domain} found in whitelist.txt -> Legitimate Domain\n", "green")
# else:
#     decorated_println(f"{domain} not found in whitelist.txt Falling back to Rule Based Engine\n", "red")
get_score(domain)

