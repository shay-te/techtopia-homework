import { XMLParser } from 'fast-xml-parser';
import { Draw, Rect } from "../data/Draw";
import { DrawDataAccess } from "../dataAccess/DrawDataAccess";
import { ObjectId } from 'mongodb';

export class DrawService {
  constructor(private drawDA: DrawDataAccess) {}

  /** Parse SVG string into array of Rects */
  parseSVG(svgStr: string): Rect[] {  
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const parsed = parser.parse(svgStr);
    const svg = parsed.svg || {};
    let rects = svg.rect || [];
    if (!Array.isArray(rects)) rects = [rects];
    if (rects.length == 0) {
      throw new Error("EMPTY");
    }
    const width = svg.width;
    const height = svg.height;

    const result: any[] = [];
    for (const draw of rects) {
      if ((parseInt(draw.x) + parseInt(draw.width)) > parseInt(width) || (parseInt(draw.y) + parseInt(draw.height)) > parseInt(height)) {
        throw new Error("OUT_OF_BOUNDS");
      }
      result.push({
        x: draw.x !== undefined ? Number(draw.x) : 0,
        y: draw.y !== undefined ? Number(draw.y) : 0,
        width: draw.width !== undefined ? Number(draw.width) : 0,
        height: draw.height !== undefined ? Number(draw.height) : 0,
        fill: draw.fill || '#000000',
      });
    }
    return result;
  }

  /** Create a new Draw */
  async create(name: string, svgStr: string) {
    const items = this.parseSVG(svgStr);
    return this.drawDA.create({ name, items });
  }

  /** Update an existing Draw by ObjectId */
  async update(id: ObjectId, name?: string, svgStr?: string) {
    const updateData: Partial<Omit<Draw, '_id'>> = {};

    if (name !== undefined) updateData.name = name;
    if (svgStr !== undefined) updateData.items = this.parseSVG(svgStr);

    return this.drawDA.update(id, updateData);
  }

  /** Get a Draw by ObjectId */
  async get(id: ObjectId) {
    return this.drawDA.get(id);
  }

  /** List all Draws */
  async listDraws() {
    return this.drawDA.listAll();
  }

  /** Soft delete a Draw */
  async delete(id: ObjectId) {
    const draw = await this.get(id);
    if (!draw) return null;
    return this.drawDA.softDelete(draw);
  }
}