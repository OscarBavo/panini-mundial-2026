'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GRUPOS: Record<string, string[]> = {
  'A': ['México', 'Sudáfrica', 'Corea del Sur', 'Chequia'],
  'B': ['Canadá', 'Suiza', 'Qatar', 'Bosnia y Herzegovina'],
  'C': ['Brasil', 'Marruecos', 'Haití', 'Escocia'],
  'D': ['Estados Unidos', 'Paraguay', 'Australia', 'Turquía'],
  'E': ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'],
  'F': ['Países Bajos', 'Japón', 'Túnez', 'Suecia'],
  'G': ['Bélgica', 'Egipto', 'Irán', 'Nueva Zelanda'],
  'H': ['España', 'Cabo Verde', 'Arabia Saudita', 'Uruguay'],
  'I': ['Francia', 'Senegal', 'Noruega', 'Iraq'],
  'J': ['Argentina', 'Argelia', 'Austria', 'Jordania'],
  'K': ['Portugal', 'Colombia', 'Uzbekistán', 'Rep. Dem. del Congo'],
  'L': ['Inglaterra', 'Croacia', 'Ghana', 'Panamá'],
};

export default function SubirPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    selection: '',
    player_name: '',
    number: '',
    quantity: 1,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    const data = new FormData();
    data.append('selection', form.selection);
    data.append('player_name', form.player_name);
    data.append('number', form.number);
    data.append('quantity', form.quantity.toString());
    if (imageFile) data.append('image', imageFile);

    const res = await fetch('/api/stickers', { method: 'POST', body: data });
    setSubmitting(false);

    if (res.ok) {
      setSuccess(true);
      setForm({ selection: '', player_name: '', number: '', quantity: 1 });
      removeImage();
    } else {
      const d = await res.json();
      setError(d.error || 'Error al guardar la estampa');
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-green-700 hover:text-green-800 text-sm font-medium inline-flex items-center gap-1">
            ← Volver
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/login');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Subir Estampa Repetida</h1>
        <p className="text-gray-500 text-sm mt-1">
          Registra las estampas que tienes repetidas para ofrecer en intercambio
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-800 text-sm">¡Estampa guardada correctamente!</p>
            <p className="text-xs text-green-600 mt-0.5">
              Ya aparece en la lista.{' '}
              <Link href="/" className="underline font-medium">
                Ver estampas disponibles
              </Link>
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
      >
        {/* Selección */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selección <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.selection}
            onChange={e => setForm(f => ({ ...f, selection: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="" disabled>Selecciona una selección…</option>
            {Object.entries(GRUPOS).map(([grupo, equipos]) => (
              <optgroup key={grupo} label={`Grupo ${grupo}`}>
                {equipos.map(equipo => (
                  <option key={equipo} value={equipo}>{equipo}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Nombre del jugador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del jugador <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.player_name}
            onChange={e => setForm(f => ({ ...f, player_name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Lionel Messi"
          />
        </div>

        {/* Número y cantidad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de estampa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.number}
              onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: 42"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad repetidas <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              max={99}
              value={form.quantity}
              onChange={e =>
                setForm(f => ({ ...f, quantity: Math.max(1, parseInt(e.target.value) || 1) }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen{' '}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Máx 5 MB</p>
            </div>
            {imagePreview && (
              <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none transition-colors"
                  aria-label="Quitar imagen"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {submitting ? 'Guardando…' : 'Guardar Estampa'}
        </button>
      </form>
    </div>
  );
}
