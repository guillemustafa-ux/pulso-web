import { useState } from 'react';

// "dejá tu mail": formulario estático vía FormSubmit (sin backend propio).
// OJO: tras la primera activación, reemplazar el mail del endpoint por el
// alias random que da FormSubmit (no dejar el mail plano en producción).
const ENDPOINT = 'https://formsubmit.co/ajax/guille.mustafa@gmail.com';

type Estado = 'quieto' | 'enviando' | 'listo' | 'error';

export default function MailCTA() {
  const [mail, setMail] = useState('');
  const [estado, setEstado] = useState<Estado>('quieto');

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mail || estado === 'enviando') return;
    setEstado('enviando');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ mail, _subject: 'pulso — alguien dejó su mail' }),
      });
      setEstado(res.ok ? 'listo' : 'error');
    } catch {
      setEstado('error');
    }
  };

  if (estado === 'listo') {
    return <p className="mail-cta-ok">Listo, anotado. Te escribo cuando haya algo andando.</p>;
  }

  return (
    <form className="mail-cta" onSubmit={enviar}>
      <label htmlFor="mail-cta-input">
        ¿Querés que te avise cuando salga algo nuevo? Dejá tu mail.
      </label>
      <div className="mail-cta-fila">
        <input
          id="mail-cta-input"
          type="email"
          required
          placeholder="tu mail"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
        <button type="submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'enviando…' : 'avisame'}
        </button>
      </div>
      <span className="mail-cta-nota">
        {estado === 'error' ? 'Uy, algo se rompió — probá de nuevo en un rato.' : 'Sin spam: te escribo yo, solo cuando haya algo que valga la pena.'}
      </span>
    </form>
  );
}
