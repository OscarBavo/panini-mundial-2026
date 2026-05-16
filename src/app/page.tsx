'use client';

import { useState, useEffect } from 'react';

type Sticker = {
  id: number;
  selection: string;
  player_name: string;
  number: string;
  quantity: number;
  image_path: string | null;
  is_active: number;
  created_at: string;
};

type ExchangeForm = {
  name: string;
  email: string;
  offer: string;
};

export default function HomePage() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Sticker | null>(null);
  const [form, setForm] = useState<ExchangeForm>({ name: '', email: '', offer: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/stickers')
      .then(r => r.json())
      .then((data: Sticker[]) => {
        setStickers(data.filter(s => s.is_active === 1 && s.quantity > 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleExchange(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/exchanges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sticker_id: selected.id,
        requester_name: form.name,
        requester_email: form.email,
        sticker_to_exchange: form.offer,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        setSelected(null);
        setSuccess(false);
        setForm({ name: '', email: '', offer: '' });
      }, 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'Error al enviar la solicitud');
    }
  }

  function closeModal() {
    setSelected(null);
    setSuccess(false);
    setError('');
    setForm({ name: '', email: '', offer: '' });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Estampas Disponibles para Intercambio
        </h1>
        <p className="text-gray-500 text-sm">
          Álbum Panini · FIFA World Cup 2026™
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4 animate-pulse">⚽</div>
          <p>Cargando estampas...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && stickers.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg font-medium text-gray-500">No hay estampas disponibles</p>
          <p className="text-sm mt-1">
            Agrega tus estampas repetidas en{' '}
            <a href="/subir" className="text-green-700 font-medium hover:underline">
              Subir Estampa
            </a>
          </p>
        </div>
      )}

      {/* Sticker grid */}
      {!loading && stickers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {stickers.map(sticker => (
            <div
              key={sticker.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Image / number badge */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                {sticker.image_path ? (
                  <img
                    src={sticker.image_path}
                    alt={sticker.player_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center px-2">
                    <div className="text-3xl font-black text-green-700">
                      #{sticker.number}
                    </div>
                    <div className="text-xs text-green-600 mt-1 font-medium uppercase tracking-wide line-clamp-2">
                      {sticker.selection}
                    </div>
                  </div>
                )}
                {/* Quantity badge */}
                {sticker.quantity > 1 && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                    {sticker.quantity}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide truncate">
                  {sticker.selection}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5 leading-tight line-clamp-2">
                  {sticker.player_name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Nº {sticker.number}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {sticker.quantity} {sticker.quantity === 1 ? 'repetida' : 'repetidas'}
                </p>
                <button
                  onClick={() => setSelected(sticker)}
                  className="mt-3 w-full bg-green-700 hover:bg-green-800 active:bg-green-900 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  Solicitar Intercambio
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exchange Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-700">¡Solicitud Enviada!</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Nos pondremos en contacto contigo por correo para coordinar el intercambio.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Solicitar Intercambio</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selected.selection} · {selected.player_name} · Nº {selected.number}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4 flex-shrink-0"
                    aria-label="Cerrar"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleExchange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tu nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ¿Qué estampa me ofreces a cambio?
                    </label>
                    <input
                      type="text"
                      required
                      value={form.offer}
                      onChange={e => setForm(f => ({ ...f, offer: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ej: Argentina – Di María #8"
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
