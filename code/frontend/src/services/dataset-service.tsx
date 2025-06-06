// Define the Dataset interface
interface Dataset {
    id: number;
    name: string;
    description: string;
    type: string;
    species: string;
    category: string;
    technique: string;
    date: string;
  }
  
  class DatasetService {
    // Mock API data
    static mockDatasets: Dataset[] = [
      {
        id: 1,
        name: 'OCT of Human Retina',
        description: 'Optical Coherence Tomography scans of human retina',
        type: 'OCT Data',
        species: 'Human',
        category: 'Organismic',
        technique: 'Optical Coherence Tomography',
        date: '2023-10-01',
      },
      {
        id: 2,
        name: 'Spectroscopy of Metal Surfaces',
        description: 'Spectroscopic measurements of reflective metal surfaces',
        type: 'Spectroscopy',
        species: '',
        category: 'Macro',
        technique: 'Spectroscopy',
        date: '2023-08-15',
      },
    ];
  
    // Fetch all datasets (mock API call)
    async getAllDatasets(): Promise<Dataset[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(DatasetService.mockDatasets);
        }, 1000); // Simulating network latency
      });
    }
  
    // Fetch a single dataset by ID
    async getDatasetById(id: number): Promise<Dataset | undefined> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const dataset = DatasetService.mockDatasets.find((ds) => ds.id === id);
          resolve(dataset);
        }, 1000); // Simulating network latency
      });
    }

    // Add a new dataset (mock API call)
  async addDataset(newDataset: Omit<Dataset, 'id'>): Promise<Dataset> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = DatasetService.mockDatasets.length + 1;
        const datasetWithId = { ...newDataset, id: newId };
        DatasetService.mockDatasets.push(datasetWithId);
        resolve(datasetWithId);
      }, 1000); // Simulating network latency
    });
  }
  }
  
  export default new DatasetService();
  