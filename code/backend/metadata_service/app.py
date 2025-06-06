from flask import Flask, request, jsonify
import requests
from config import CROSSREF_API, DATACITE_API
from waitress import serve

app = Flask(__name__)

# Verify DOI using CrossRef API
def verify_doi_crossref(doi):
    response = requests.get(f"{CROSSREF_API}works/{doi}")
    if response.status_code == 200:
        return True, response.json()
    else:
        return False, {"message": "DOI not found in CrossRef"}

# Verify DOI using DataCite API
def verify_doi_datacite(doi):
    response = requests.get(f"{DATACITE_API}works/{doi}")
    if response.status_code == 200:
        return True, response.json()
    else:
        return False, {"message": "DOI not found in DataCite"}

# Route to fetch DOI metadata (tries both CrossRef and DataCite)
@app.route('/api/v1/metadata/<doi>', methods=['GET'])
def get_metadata(doi):
    # Try CrossRef first
    valid, result = verify_doi_crossref(doi)
    if valid:
        return jsonify(result), 200
    
    # If CrossRef fails, try DataCite
    valid, result = verify_doi_datacite(doi)
    if valid:
        return jsonify(result), 200

    return jsonify({"message": "DOI not found in either CrossRef or DataCite"}), 404

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5004)
