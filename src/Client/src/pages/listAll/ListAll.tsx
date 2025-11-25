import React, { useEffect, useState } from 'react';
import TopNavigationBar from '../../components/ui/TopNavigationBar';
import type { FileItem } from '../../components/types';
import { Draw, DrawClient } from 'client/Client';
import CanvasPanel from '../../components/CanvasPanel';

const client = new DrawClient();

const ListAll = () => {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [draw, setDraw] = useState<Draw | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const allDraws = await client.list();
      setDraws(allDraws);
    }
    fetchAll();
  }, [])
  const handleDrawClick = (draw: Draw) => {
    setDraw(draw);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigationBar />

      <main className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              File Library
            </h1>
            <p className="text-muted-foreground">
              All uploaded Draws
            </p>
          </div>
          <div style={{flexDirection: 'row'}}>
            <div className="bg-card rounded-lg border border-border">
              <ul className="divide-y divide-border">
                {draws.map((draw) => (
                  <li 
                    key={draw.name} 
                    onClick={() => {handleDrawClick(draw)}}
                    className="px-6 py-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <p className="text-foreground font-medium">{draw.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
                <CanvasPanel draw={draw}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListAll;