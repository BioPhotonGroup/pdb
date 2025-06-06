from datetime import datetime
from database import db
import uuid

class Dataset(db.Model):
    __tablename__ = 'datasets'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    author_id = db.Column(db.String(36), nullable=False)
    organism_source_name = db.Column(db.String(255), nullable=False)
    organism_source_localization = db.Column(db.Text, nullable=True)
    data_source = db.Column(db.String(255), nullable=True)
    quantity_of_data = db.Column(db.Numeric, nullable=True)
    format = db.Column(db.String(50), nullable=False)
    measurement_technique_id = db.Column(db.String(36), db.ForeignKey('measurement_techniques.id'))
    instrument_used = db.Column(db.String(255), nullable=True)
    measurement_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved = db.Column(db.Boolean, default=False)
    archived = db.Column(db.Boolean, default=False)

class ArticlesDOI(db.Model):
    __tablename__ = 'articles_doi'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = db.Column(db.String(36), db.ForeignKey('datasets.id', ondelete='CASCADE'), nullable=False)
    doi = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Keyword(db.Model):
    __tablename__ = 'keywords'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    keyword = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MeasurementTechnique(db.Model):
    __tablename__ = 'measurement_techniques'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    technique_name = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DatasetKeyword(db.Model):
    __tablename__ = 'dataset_keywords'

    dataset_id = db.Column(db.String(36), db.ForeignKey('datasets.id', ondelete='CASCADE'), primary_key=True)
    keyword_id = db.Column(db.String(36), db.ForeignKey('keywords.id', ondelete='CASCADE'), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
