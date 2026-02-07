from dnsquery.geolocation import get_asn, get_country
from dnsquery.domain_age import get_domain_age_days
from dnsquery.nsquery import analyze_dns
from statistics import median, stdev

from tinylogging import new_event


def get_dnsq_features(dnsqr: dict) -> dict:
    res = dict()
    res['ip_count'] = dnsqr['num_ips']

    ttls = dnsqr['ttls']
    if ttls:
        res['median_ttl'] = median(ttls)
    else:
        res['median_ttl'] = 0

    return res



def get_geolocation_features(dnsqr: dict) -> dict:
    res = {"asn": [], "geoloc": []}

    new_event("Loading GeoLite2-ASN.mmdb", "cyan")
    new_event("Loading GeoLite2-Country.mmdb\n", "cyan")

    for ip in dnsqr.get('ips', []):
        asn = get_asn(ip)
        country = get_country(ip)

        if asn is not None:
            res["asn"].append(asn)
        if country is not None:
            res["geoloc"].append(country)

    unique_asns = set(res["asn"])
    unique_countries = set(res["geoloc"])

    features = {
        "asn_diversity": len(unique_asns),
        "geo_diversity": len(unique_countries),
    }

    return features



def get_domain_age(domain: str) -> int:
    return get_domain_age_days(domain)



def get_domain_features(domain: str, dns_server: str, timeout: int) -> dict:
    new_event("Getting Domain Features\n", "cyan")
    dnsqr = analyze_dns(domain, dns_server, timeout)
    dns_features = dict()

    dnsqf = get_dnsq_features(dnsqr)
    for i in dnsqf:
        dns_features[i] = dnsqf[i]

    glcf = get_geolocation_features(dnsqr)
    for i in glcf:
        dns_features[i] = glcf[i]

    dns_features["domain_age"] = get_domain_age(domain)

    dns_features["mannheim_rule"] = round(1.32 * dns_features["ip_count"] + 18.54 * dns_features["asn_diversity"], 2)

    print(f"\n{"\033[95m"} === DNS Features ==={"\033[0m"}")
    for k, v in dns_features.items():
        print(f"{k}: {v}")
    print("\n")

    return dns_features




