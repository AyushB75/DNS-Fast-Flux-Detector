import dns.message
import dns.query
import dns.rdatatype
from tinylogging import new_event

def analyze_dns(domain, server="8.8.8.8", timeout=3):
    new_event("Building DNS Query", "blue")
    print(f"\n{"\033[95m"} === DNS Query ==={"\033[0m"}")
    print(f"Domain: {domain}\nDNS Server: {server}\nTimeout: {timeout}\n")
    # Build 'A' record query
    request = dns.message.make_query(domain, dns.rdatatype.A)
    response = dns.query.udp(request, server, timeout)

    new_event("Received DNS response", "green")

    result = dict()

    new_event("Processing DNS response", "blue")

    # QUESTION SECTION
    result['questions'] = [q.to_text() for q in response.question]

    # ANSWER SECTION
    result['answers'] = []
    for ans in response.answer:
        for rdata in ans:
            record_info = {
                'type': dns.rdatatype.to_text(rdata.rdtype),
                'data': rdata.to_text(),
                'ttl': ans.ttl
            }
            result['answers'].append(record_info)

    # AUTHORITY SECTION
    result['authorities'] = []
    for auth in response.authority:
        for rdata in auth:
            record_info = {
                'type': dns.rdatatype.to_text(rdata.rdtype),
                'data': rdata.to_text(),
                'ttl': auth.ttl
            }
            result['authorities'].append(record_info)

    # ADDITIONAL SECTION
    result['additionals'] = []
    for add in response.additional:
        for rdata in add:
            record_info = {
                'type': dns.rdatatype.to_text(rdata.rdtype),
                'data': rdata.to_text(),
                'ttl': add.ttl
            }
            result['additionals'].append(record_info)


    # ANSWERS
    result['ips'] = [r['data'] for r in result['answers'] if r['type'] in ['A', 'AAAA']]
    result['num_ips'] = len(result['ips'])
    result['ttls'] = [r['ttl'] for r in result['answers']]
    result['min_ttl'] = min(result['ttls'], default=None)

    # AUTHORITIES
    result['ns_data'] = [r['data'] for r in result['authorities'] if r['type'] == 'NS']
    result['num_ns'] = len(result['ns_data'])
    result['num_authoritative'] = len(response.authority)
    result['ns_ttls'] = [r['ttl'] for r in result['authorities']]
    result['min_ns_ttl'] = min(result['ns_ttls'], default=None)

    # ADDITIONALS
    result['additional_data'] = [r['data'] for r in result['additionals']]
    result['num_additionals'] = len(result['additionals'])
    result['additional_ttls'] = [r['ttl'] for r in result['additionals']]
    result['min_additional_ttl'] = min(result['additional_ttls'], default=None)

    # RESPONSE CODE
    result['rcode'] = response.rcode()

    new_event("Done\n", "green")

    return result

