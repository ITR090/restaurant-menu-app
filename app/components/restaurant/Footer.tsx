import { AboutInfo } from '@/lib/firebase';

interface FooterProps {
  info: AboutInfo | null;
}

export function Footer({ info }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
        <h3 className="text-xl font-bold text-white mb-4">
          {info?.name || 'Restaurant System'}
        </h3>
        
        <div className="flex flex-col gap-2 mb-8 text-sm">
          {info?.phone && <p>📞 {info.phone}</p>}
          {info?.location && <p>📍 {info.location}</p>}
        </div>
      </div>
    </footer>
  );
}
