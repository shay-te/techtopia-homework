// DrawService.int.test.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DrawDataAccess } from '../src/DrawLib/dataLayers/dataAccess/DrawDataAccess';
import { DrawService } from '../src/DrawLib/dataLayers/service/DrawService';
import { Draw } from '../src/DrawLib/dataLayers/data/Draw';

let dataSource: DataSource;
let drawDA: DrawDataAccess;
let service: DrawService;
let mongoServer: MongoMemoryServer | null = null;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  dataSource = new DataSource({
    type: 'mongodb',
    url: mongoUri,
    database: 'test-db',
    entities: [Draw],

  });
  await dataSource.initialize();

  drawDA = new DrawDataAccess(dataSource);
  service = new DrawService(drawDA);
});

afterAll(async () => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('DrawService with SQLite - Super Resilient Tests', () => {

  it('parses, stores, and retrieves complex rects correctly', async () => {
    const svg = `
      <svg>
        <rect x="0" y="0" width="10" height="20" fill="#ff0000"/>
        <rect x="5.5" y="-3" width="15" height="25"/>
        <rect width="7" height="14" fill="#00ff00"/>
      </svg>
    `;

    const created = await service.create('ComplexDraw', svg);

    // Check high-level fields
    expect(created.id).toBeDefined();
    expect(created.name).toBe('ComplexDraw');
    expect(created.items.length).toBe(3);

    // Validate all rects individually
    const rect1 = created.items[0];
    expect(rect1).toEqual({ x: 0, y: 0, width: 10, height: 20, fill: '#ff0000' });

    const rect2 = created.items[1];
    expect(rect2.x).toBeCloseTo(5.5);
    expect(rect2.y).toBe(-3);
    expect(rect2.width).toBe(15);
    expect(rect2.height).toBe(25);
    expect(rect2.fill).toBe('#000000'); // default fill applied

    const rect3 = created.items[2];
    expect(rect3.x).toBe(0); // defaulted
    expect(rect3.y).toBe(0); // defaulted
    expect(rect3.width).toBe(7);
    expect(rect3.height).toBe(14);
    expect(rect3.fill).toBe('#00ff00');

    // Retrieve from DB and verify consistency
    const fetched = await service.get(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.items).toHaveLength(3);
    expect(fetched?.items).toEqual(created.items);
  });

  it('updates rects correctly', async () => {
    const svg1 = `<svg><rect x="1" y="1" width="5" height="5" fill="#111"/></svg>`;
    const svg2 = `<svg><rect x="2" y="2" width="10" height="10" fill="#222"/><rect x="3" y="3" width="6" height="6"/></svg>`;

    const draw = await service.create('UpdateRectTest', svg1);
    await service.update(draw.id, undefined, svg2);

    const updated = await service.get(draw.id);
    expect(updated?.items.length).toBe(2);

    const [r1, r2] = updated!.items;
    expect(r1).toEqual({ x: 2, y: 2, width: 10, height: 10, fill: '#222' });
    expect(r2).toEqual({ x: 3, y: 3, width: 6, height: 6, fill: '#000000' });
  });

  it('soft deletes a draw and ensures it is gone', async () => {
    const draw = await service.create('DeleteRectTest', `<svg><rect x="0" y="0" width="1" height="1"/></svg>`);
    await service.delete(draw.id);

    const deleted = await service.get(draw.id);
    expect(deleted).toBeNull();
  });

});