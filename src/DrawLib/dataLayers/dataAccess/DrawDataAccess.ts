// DrawDataAccess.ts
import { MongoRepository, DataSource } from 'typeorm';
import { Draw } from '../data/Draw';
import { ObjectId } from 'mongodb';

export class DrawDataAccess {
  private repo: MongoRepository<Draw>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getMongoRepository(Draw);
  }

  async get(id: ObjectId): Promise<Draw | null> {
    return this.repo.findOne({ where: { _id: id, deletedAt: null } });
  }

  async getByName(name: string): Promise<Draw | null> {
    return this.repo.findOne({ where: { name, deletedAt: null } });
  }

  async create(draw: Partial<Draw>): Promise<Draw> {
    const entity = this.repo.create(draw);
    return this.repo.save(entity);
  }

  async update(id: ObjectId, updateData: Partial<Omit<Draw, '_id'>>) {
    await this.repo.update(id, updateData); // no $set needed
  }

  async listAll(): Promise<Draw[]> {
    return this.repo.find({ where: { deletedAt: null } });
  }

  async softDelete(draw: Draw): Promise<void> {
    draw.deletedAt = new Date();
    await this.repo.save(draw);
  }
}