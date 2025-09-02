export default function Preloader() {
  return (
        <div className="page-loader fixed inset-0 bg-[#142440] flex items-center justify-center z-50">
          <div className="page-loader-inner text-center">
            
            {/* Texto del logo */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-2">
                TransFrant
              </h1>
              <p className="text-slate-400 text-sm">Cargando sistema...</p>
            </div>

            {/* Spinner principal */}
            <div className="inner relative">
              {/* Círculo exterior */}
              <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
              
              {/* Puntos de carga */}
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>

            {/* Texto de carga */}
            <div className="mt-6 text-slate-300 text-sm animate-pulse">
              Preparando monitoreo en tiempo real...
            </div>
          </div>
        </div>
  );
}