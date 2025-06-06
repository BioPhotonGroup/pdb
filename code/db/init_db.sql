-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    familyname VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP
);

-- Insert Seed Data into Users Table
INSERT INTO users (email, firstname, familyname, password_hash, role, status)
VALUES 
    ('admin@example.com', 'Admin', 'User', 'hashed_password_1', 'admin', 'active'),
    ('user1@example.com', 'John', 'Doe', 'hashed_password_2', 'user', 'active'),
    ('user2@example.com', 'Jane', 'Doe', 'hashed_password_3', 'user', 'pending');

-- Measurement Techniques Table (Directory)
CREATE TABLE IF NOT EXISTS measurement_techniques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technique_name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Seed Data into Measurement Techniques Table
INSERT INTO measurement_techniques (technique_name)
VALUES 
    ('Optical Coherence Tomography'),
    ('Microscopy'),
    ('Spectroscopy');

-- Datasets Table
CREATE TABLE IF NOT EXISTS datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id UUID REFERENCES users(id),
    organism_source_name VARCHAR(255) NOT NULL,
    organism_source_localization TEXT,
    data_source VARCHAR(255),
    quantity_of_data DECIMAL,
    format VARCHAR(50) NOT NULL,
    measurement_technique_id UUID REFERENCES measurement_techniques(id),
    instrument_used VARCHAR(255),
    measurement_notes TEXT,
    version INT DEFAULT 1,
    approved BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'restricted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodby UUID REFERENCES users(id),
    lastmod_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Seed Data into Datasets Table
INSERT INTO datasets (name, description, author_id, organism_source_name, data_source, quantity_of_data, format, measurement_technique_id, instrument_used, approved, visibility)
VALUES 
    ('Dataset 1', 'First test dataset', (SELECT id FROM users WHERE email = 'admin@example.com'), 'Homo sapiens', 'doi:10.1000/182', 1500, 'csv', (SELECT id FROM measurement_techniques WHERE technique_name = 'Microscopy'), 'Instrument 1', TRUE, 'public'),
    ('Dataset 2', 'Second test dataset', (SELECT id FROM users WHERE email = 'user1@example.com'), 'Pan troglodytes', 'doi:10.1000/183', 2000, 'json', (SELECT id FROM measurement_techniques WHERE technique_name = 'Spectroscopy'), 'Instrument 2', FALSE, 'restricted');

-- Articles DOI Table (One-to-Many Relationship for Multiple DOIs)
CREATE TABLE IF NOT EXISTS articles_doi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    doi TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Seed Data into Articles DOI Table
INSERT INTO articles_doi (dataset_id, doi)
VALUES 
    ((SELECT id FROM datasets WHERE name = 'Dataset 1'), 'doi:10.1000/1821'),
    ((SELECT id FROM datasets WHERE name = 'Dataset 2'), 'doi:10.1000/1831');

-- Keywords Table
CREATE TABLE IF NOT EXISTS keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Seed Data into Keywords Table
INSERT INTO keywords (keyword)
VALUES 
    ('OCT'),
    ('Microscopy'),
    ('Spectroscopy');

-- Association Table for Dataset Keywords (Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS dataset_keywords (
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    PRIMARY KEY (dataset_id, keyword_id)
);

-- Insert Seed Data into Dataset Keywords Table
INSERT INTO dataset_keywords (dataset_id, keyword_id)
VALUES 
    ((SELECT id FROM datasets WHERE name = 'Dataset 1'), (SELECT id FROM keywords WHERE keyword = 'OCT')),
    ((SELECT id FROM datasets WHERE name = 'Dataset 1'), (SELECT id FROM keywords WHERE keyword = 'Microscopy')),
    ((SELECT id FROM datasets WHERE name = 'Dataset 2'), (SELECT id FROM keywords WHERE keyword = 'Spectroscopy'));

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id),
    dataset_id UUID REFERENCES datasets(id),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to automatically log changes to datasets
CREATE OR REPLACE FUNCTION log_dataset_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action, user_id, dataset_id, details, timestamp)
    VALUES (
        TG_OP || ' on dataset',
        NEW.lastmodby,
        NEW.id,
        'Dataset has been ' || TG_OP || '.',
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT/UPDATE/DELETE on datasets
CREATE TRIGGER dataset_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON datasets
FOR EACH ROW
EXECUTE FUNCTION log_dataset_changes();

-- Function to automatically log changes to users
CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action, user_id, dataset_id, details, timestamp)
    VALUES (
        TG_OP || ' on user',
        NEW.id,
        NULL,
        'User has been ' || TG_OP || '.',
        CURRENT_TIMESTAMP
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT/UPDATE/DELETE on users
CREATE TRIGGER user_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_changes();

-- Create a trigger to update the lastmod_at column automatically
CREATE OR REPLACE FUNCTION update_lastmod_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.lastmod_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lastmod_at_trigger
BEFORE UPDATE ON datasets
FOR EACH ROW
EXECUTE FUNCTION update_lastmod_at();
