'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Sticker = {
  id: number;
  selection: string;
  player_name: string;
  number: string;
  quantity: number;
  image_path: string | null;
  is_active: number;
  created_at: string;
  exchange_count?: number;
};

type ExchangeRequest = {
  id: number;
  sticker_id: number;
  requester_name: string;
  requester_email: string;
  sticker_to_exchange: string;
  created_at: string;
};

export default function AdminPage() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingExchanges, setViewingExchanges] = useState<Sticker | null>(null);
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [loadingExchanges, setLoadingExchanges] = useState(false);
  const [toggling, setToggling] = useState<number | null>(null);

  const loadStickers = useCallback(async () => {
    const [stickersRes, exchangesRes] = await Promise.all([
      fetch('/api/stickers'),
      fetch('/api/exchanges'),
    ]);
    const stickersData: Sticker[] = await stickersRes.json();
    const allExchanges: ExchangeRequest[] = await exchangesRes.json();

    const countMap: Record<number, number> = {};
    allExchanges.forEach(ex => {
      countMap[ex.sticker_id] = (countMap[ex.sticker_id] || 0) + 1;
    });

    setStickers(stickersData.map(s => ({ ...s, exchange_count: countMap[s.id] || 0 })));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStickers();
  }, [loadStickers]);

  async function toggleActive(sticker: Sticker) {
    setToggling(sticker.id);
    const newActive = sticker.is_active === 0;
    await fetch(`/api/stickers/${sticker.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: newActive }),
    });
    await loadStickers();
    setToggling(null);
  }

  async function openExchanges(sticker: Sticker) {
    setViewingExchanges(sticker);
    setLoadingExchanges(true);
    const res = await fetch(`/api/exchanges?sticker_id=${sticker.id}`);
    setExchanges(await res.json());
    setLoadingExchanges(false);
  }

  const active = stickers.filter(s => s.is_active === 1);
  const inactive = stickers.filter(s => s.is_active === 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/" className="text-green-700 hover:text-green-800 text-sm font-medium">
            ← Volver
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Panel de Administración</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona tus estampas y solicitudes de intercambio
          </p>
        </div>
        <Link
          href="/subir"
          className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          + Agregar
        </Link>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stickers.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-4">
            <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Activas</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{active.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Intercambiadas</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">{inactive.length}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4 animate-pulse">⚽</div>
          <p>Cargando...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && stickers.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-medium text-gray-500">No hay estampas registradas</p>
          <Link href="/subir" className="text-green-700 hover:underline text-sm mt-2 inline-block">
            Agregar primera estampa →
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && stickers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide w-14">
                    Img
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Selección
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Jugador
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Nº
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Cant.
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Solicitudes
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stickers.map(sticker => (
                  <tr
                    key={sticker.id}
                    className={`hover:bg-gray-50/60 transition-colors ${
                      sticker.is_active === 0 ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      {sticker.image_path ? (
                        <img
                          src={sticker.image_path}
                          alt={sticker.player_name}
                          className="w-10 h-12 object-cover rounded-md border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-md flex items-center justify-center text-xs font-bold text-green-700">
                          {sticker.number}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{sticker.selection}</td>
                    <td className="px-4 py-3 text-gray-900">{sticker.player_name}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono">{sticker.number}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">{sticker.quantity}</span>
                    </td>
                    <td className="px-4 py-3">
                      {sticker.is_active === 1 ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Intercambiada
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {(sticker.exchange_count ?? 0) > 0 ? (
                        <button
                          onClick={() => openExchanges(sticker)}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors"
                        >
                          <span className="bg-blue-100 text-blue-700 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {sticker.exchange_count}
                          </span>
                          Ver
                        </button>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(sticker)}
                        disabled={toggling === sticker.id}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          sticker.is_active === 1
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {toggling === sticker.id
                          ? '…'
                          : sticker.is_active === 1
                          ? 'Deshabilitar'
                          : 'Rehabilitar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exchange requests modal */}
      {viewingExchanges && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setViewingExchanges(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Solicitudes de Intercambio</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {viewingExchanges.selection} · {viewingExchanges.player_name} · Nº{' '}
                  {viewingExchanges.number}
                </p>
              </div>
              <button
                onClick={() => setViewingExchanges(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {loadingExchanges ? (
              <p className="text-center text-gray-400 py-10">Cargando solicitudes…</p>
            ) : exchanges.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No hay solicitudes aún</p>
            ) : (
              <div className="space-y-3">
                {exchanges.map(ex => (
                  <div
                    key={ex.id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{ex.requester_name}</p>
                        <a
                          href={`mailto:${ex.requester_email}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {ex.requester_email}
                        </a>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-3">
                        {new Date(ex.created_at).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <span className="text-xs text-amber-700 font-semibold uppercase tracking-wide">
                        Ofrece:{' '}
                      </span>
                      <span className="text-sm text-gray-800">{ex.sticker_to_exchange}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
