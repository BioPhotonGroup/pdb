import datasets from './datasets.json';


export class DatasetService {
  static mockDatasets: Dataset[] = datasets;

  async getAllDatasets(): Promise<Dataset[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetService.mockDatasets);
      }, 1000);
    });
  }

  async getDatasetById(id: number): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dataset = DatasetService.mockDatasets.find((ds) => ds.id === id);
        resolve(dataset);
      }, 1000);
    });
  }

  async addDataset(newDataset: Omit<Dataset, 'id'>): Promise<Dataset> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = DatasetService.mockDatasets.length + 1;
        const datasetWithId = { ...newDataset, id: newId };
        DatasetService.mockDatasets.push(datasetWithId);
        fs.writeFileSync(
          DatasetService.datasetFilePath,
          JSON.stringify(DatasetService.mockDatasets, null, 2),
          'utf-8'
        );
        resolve(datasetWithId);
      }, 1000);
    });
  }
}

export default new DatasetService();
  