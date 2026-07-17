import { del } from '@vercel/blob';

// Borrado rápido del muro — solo con la llave admin de Guille
// (salvaguarda del guardián: contenido que no va, se saca al toque).
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'método no permitido' });
    return;
  }
  const { url, llave } = req.body ?? {};
  if (!process.env.MURO_ADMIN_TOKEN || llave !== process.env.MURO_ADMIN_TOKEN) {
    res.status(401).json({ error: 'llave inválida' });
    return;
  }
  if (typeof url !== 'string' || !url.includes('/huellas/')) {
    res.status(400).json({ error: 'url inválida' });
    return;
  }
  await del(url);
  res.json({ ok: true });
}
