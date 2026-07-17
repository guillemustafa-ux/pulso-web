import { list, put } from '@vercel/blob';

// El muro: guarda y lista las huellas que dejan los visitantes en el lienzo.
// Todas quedan archivadas por fecha para los compilados semanal/mensual;
// la página solo muestra las últimas VISIBLES.
const VISIBLES = 12;
const PESO_MAXIMO = 700_000; // ~500 KB de PNG en base64
const PREFIJO = 'data:image/png;base64,';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const { blobs } = await list({ prefix: 'huellas/', limit: 1000 });
    const ordenadas = blobs.sort(
      (a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt),
    );
    res.json({
      total: ordenadas.length,
      huellas: ordenadas.slice(0, VISIBLES).map((b) => ({ url: b.url, subida: b.uploadedAt })),
    });
    return;
  }

  if (req.method === 'POST') {
    const { imagen } = req.body ?? {};
    if (typeof imagen !== 'string' || !imagen.startsWith(PREFIJO)) {
      res.status(400).json({ error: 'imagen inválida' });
      return;
    }
    if (imagen.length > PESO_MAXIMO) {
      res.status(413).json({ error: 'la huella pesa demasiado' });
      return;
    }
    const buffer = Buffer.from(imagen.slice(PREFIJO.length), 'base64');
    const fecha = new Date().toISOString().slice(0, 10);
    const blob = await put(`huellas/${fecha}/huella.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: true,
    });
    res.status(201).json({ url: blob.url });
    return;
  }

  res.status(405).json({ error: 'método no permitido' });
}
