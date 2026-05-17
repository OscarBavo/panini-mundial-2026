import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 px-6 mt-auto border-t border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-zinc-800 pb-8">
        
        {/* Información de la marca */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-wider">MKRS</h3>
          <p className="text-sm max-w-xs text-zinc-500">
            Creando soluciones digitales y conectando coleccionistas de todo el mundo.
          </p>
        </div>

        {/* Enlaces de navegación rápida */}
        <div className="flex gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-zinc-200">Plataforma</span>
            {/*<Link href="/album" className="hover:text-white transition-colors">Mi Álbum</Link>*/}
            <Link href="/" className="hover:text-white transition-colors font-medium text-blue-400">Intercambiar</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-zinc-200">Soporte</span>
            <Link href="/faq" className="hover:text-white transition-colors">Ayuda / FAQ</Link>
          </div>
        </div>
      </div>

      {/* Créditos y Deslinde Legal */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col items-center text-center gap-4">
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Creado por <span className="text-zinc-200 font-semibold">MKRS</span>. Todos los derechos reservados.
        </p>
        <p className="text-[10px] text-zinc-600 max-w-3xl leading-relaxed">
          *Aviso de exención de responsabilidad: Este sitio web es una plataforma independiente para fanáticos de las estampas del mundial y no está afiliado, asociado, patrocinado ni respaldado por la FIFA, Panini, ni ninguna de sus subsidiarias o marcas registradas.
        </p>
      </div>
    </footer>
  );
}