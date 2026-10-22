export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Día 1: Arquitectura Multi-Schema Lista
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3 text-slate-900 dark:text-white">
          VetSaaS Multitenant
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 mb-6">
          Plataforma modular para la administración de clínicas veterinarias con aislamiento por schema de PostgreSQL en Next.js (App Router).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">
              🏢 Schema Global (public)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gestión central de Tenants (clínicas), Usuarios, Roles y Membresías.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">
              🐾 Schema Aislado (tenant_*)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Datos privados de Pacientes, Clientes, Consultas y Fármacos.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

