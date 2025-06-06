from flask import Flask, request, jsonify
from models import Dataset, ArticlesDOI, Keyword, MeasurementTechnique, DatasetKeyword, db
from config import SQLALCHEMY_DATABASE_URI
import requests
from datetime import datetime
from waitress import serve

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# -----------------------------------
# Dataset Endpoints
# -----------------------------------

# Validate payload data
def validate_payload(data):
    required_fields = ['name', 'author_id', 'organism_source_name', 'format']
    for field in required_fields:
        if not data.get(field):
            return False, f"Missing required field: {field}"
    return True, None

# Verify DOI from external service (e.g., CrossRef)
def verify_doi(doi):
    response = requests.get(f"https://api.crossref.org/works/{doi}")
    return response.status_code == 200

# Route to create a dataset
@app.route('/api/v1/dataset', methods=['POST'])
def create_dataset():
    data = request.get_json()

    # Step 1: Payload validation
    valid, message = validate_payload(data)
    if not valid:
        return jsonify({"message": message}), 400

    # Step 2: Verify source DOI if provided
    source_doi = data.get('data_source')
    if source_doi and not verify_doi(source_doi):
        return jsonify({"message": "Invalid source DOI"}), 400

    # Step 3: Verify article DOIs if provided
    article_dois = data.get('article_dois', [])
    for doi in article_dois:
        if not verify_doi(doi):
            return jsonify({"message": f"Invalid article DOI: {doi}"}), 400

    # Step 4: Add dataset to the database
    dataset = Dataset(
        name=data['name'],
        description=data.get('description'),
        author_id=data['author_id'],
        organism_source_name=data['organism_source_name'],
        organism_source_localization=data.get('organism_source_localization'),
        data_source=source_doi,
        quantity_of_data=data.get('quantity_of_data'),
        format=data['format'],
        measurement_technique_id=data.get('measurement_technique_id'),
        instrument_used=data.get('instrument_used'),
        measurement_notes=data.get('measurement_notes')
    )
    db.session.add(dataset)
    db.session.commit()

    # Step 5: Save article DOIs (if any)
    for doi in article_dois:
        article_doi = ArticlesDOI(dataset_id=dataset.id, doi=doi)
        db.session.add(article_doi)
    
    db.session.commit()

    return jsonify({"message": "Dataset created", "dataset_id": dataset.id}), 201

# Route to retrieve all datasets
@app.route('/api/v1/dataset', methods=['GET'])
def get_datasets():
    datasets = Dataset.query.all()
    results = [
        {
            "id": dataset.id,
            "name": dataset.name,
            "description": dataset.description,
            "author_id": dataset.author_id,
            "created_at": dataset.created_at,
            "approved": dataset.approved,
            "archived": dataset.archived
        } for dataset in datasets
    ]
    return jsonify(results), 200

# Route to retrieve a specific dataset by ID
@app.route('/api/v1/dataset/<dataset_id>', methods=['GET'])
def get_dataset(dataset_id):
    dataset = Dataset.query.filter_by(id=dataset_id).first()
    if not dataset:
        return jsonify({"message": "Dataset not found"}), 404

    result = {
        "id": dataset.id,
        "name": dataset.name,
        "description": dataset.description,
        "author_id": dataset.author_id,
        "created_at": dataset.created_at,
        "approved": dataset.approved,
        "archived": dataset.archived
    }
    return jsonify(result), 200

# Route to approve a dataset (Admin only)
@app.route('/api/v1/dataset/<dataset_id>/approve', methods=['PUT'])
def approve_dataset(dataset_id):
    dataset = Dataset.query.filter_by(id=dataset_id).first()
    if not dataset:
        return jsonify({"message": "Dataset not found"}), 404

    dataset.approved = True
    db.session.commit()

    return jsonify({"message": f"Dataset {dataset_id} approved"}), 200

# -----------------------------------
# Keywords Endpoints
# -----------------------------------

@app.route('/api/v1/keywords', methods=['GET'])
def get_keywords():
    keywords = Keyword.query.all()
    results = [{"id": keyword.id, "keyword": keyword.keyword} for keyword in keywords]
    return jsonify(results), 200

@app.route('/api/v1/keywords', methods=['POST'])
def add_keyword():
    data = request.get_json()
    new_keyword = data.get('keyword')

    if not new_keyword:
        return jsonify({"message": "Keyword is required"}), 400

    # Check if keyword already exists
    existing_keyword = Keyword.query.filter_by(keyword=new_keyword).first()
    if existing_keyword:
        return jsonify({"message": "Keyword already exists"}), 400

    keyword = Keyword(keyword=new_keyword)
    db.session.add(keyword)
    db.session.commit()
    
    return jsonify({"message": "Keyword added", "id": keyword.id}), 201

@app.route('/api/v1/dataset/<dataset_id>/keywords', methods=['POST'])
def add_keywords_to_dataset(dataset_id):
    data = request.get_json()
    keyword_ids = data.get('keyword_ids')

    if not keyword_ids or not isinstance(keyword_ids, list):
        return jsonify({"message": "A list of keyword IDs is required"}), 400

    dataset = Dataset.query.filter_by(id=dataset_id).first()
    if not dataset:
        return jsonify({"message": "Dataset not found"}), 404

    # Add keywords to dataset
    for keyword_id in keyword_ids:
        keyword = Keyword.query.filter_by(id=keyword_id).first()
        if not keyword:
            return jsonify({"message": f"Keyword ID {keyword_id} not found"}), 404

        dataset_keyword = DatasetKeyword(dataset_id=dataset.id, keyword_id=keyword.id)
        db.session.add(dataset_keyword)

    db.session.commit()
    
    return jsonify({"message": "Keywords added to dataset"}), 201

@app.route('/api/v1/dataset/<dataset_id>/keywords', methods=['GET'])
def get_keywords_for_dataset(dataset_id):
    dataset = Dataset.query.filter_by(id=dataset_id).first()
    if not dataset:
        return jsonify({"message": "Dataset not found"}), 404

    keywords = db.session.query(Keyword).join(DatasetKeyword).filter(DatasetKeyword.dataset_id == dataset_id).all()
    results = [{"id": keyword.id, "keyword": keyword.keyword} for keyword in keywords]

    return jsonify(results), 200

# -----------------------------------
# Measurement Techniques Endpoints
# -----------------------------------

@app.route('/api/v1/measurement_techniques', methods=['GET'])
def get_measurement_techniques():
    techniques = MeasurementTechnique.query.all()
    results = [{"id": technique.id, "technique_name": technique.technique_name} for technique in techniques]
    return jsonify(results), 200

@app.route('/api/v1/measurement_techniques', methods=['POST'])
def add_measurement_technique():
    data = request.get_json()
    new_technique = data.get('technique_name')

    if not new_technique:
        return jsonify({"message": "Measurement technique name is required"}), 400

    # Check if measurement technique already exists
    existing_technique = MeasurementTechnique.query.filter_by(technique_name=new_technique).first()
    if existing_technique:
        return jsonify({"message": "Measurement technique already exists"}), 400

    technique = MeasurementTechnique(technique_name=new_technique)
    db.session.add(technique)
    db.session.commit()
    
    return jsonify({"message": "Measurement technique added", "id": technique.id}), 201

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5003)
