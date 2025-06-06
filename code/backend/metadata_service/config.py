import os

# Allowed external DOI provider URLs
ALLOWED_URLS = [
    "https://api.crossref.org/",
    "https://api.datacite.org/"
]

# Optionally set environment variables for these URLs
CROSSREF_API = os.getenv('CROSSREF_API', 'https://api.crossref.org/')
DATACITE_API = os.getenv('DATACITE_API', 'https://api.datacite.org/')
