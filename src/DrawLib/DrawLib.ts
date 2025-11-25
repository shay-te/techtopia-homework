import { DataSource } from 'typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DrawDataAccess } from './dataLayers/dataAccess/DrawDataAccess';
import { DrawService } from './dataLayers/service/DrawService';
import { Draw } from './dataLayers/data/Draw';


export interface DrawLibConfig {
  type: 'sqlite' | 'postgres' | 'mysql' | 'mongodb' | 'memory-mongo';
  host?: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean; // TypeORM sync (dev only)
}


export class DrawLib {
  private dataSource!: DataSource;
  private mongoServer!: MongoMemoryServer;
  public drawService!: DrawService;
  constructor(private config: DrawLibConfig) {}
  /** Initialize database and services */
  async initialize() {
    if (this.config.type === 'memory-mongo') {
      // Start in-memory MongoDB
      this.mongoServer = await MongoMemoryServer.create();
      const uri = this.mongoServer.getUri();

      this.dataSource = new DataSource({
        type: 'mongodb',
        url: uri,
        database: this.config.database,
        synchronize: true, // usually true for dev/testing
        logging: false,
        entities: [Draw],
      });
    } else {
      // Regular SQL databases
      this.dataSource = new DataSource({
        type: this.config.type as any,
        host: this.config.host!,
        port: this.config.port!,
        username: this.config.username!,
        password: this.config.password!,
        database: this.config.database,
        synchronize: this.config.synchronize ?? false,
        logging: false,
        entities: [Draw],
      });
    }

    await this.dataSource.initialize();
    this.drawService = new DrawService(new DrawDataAccess(this.dataSource));
  }
  /** Close the database connection */
  async destroy() {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}