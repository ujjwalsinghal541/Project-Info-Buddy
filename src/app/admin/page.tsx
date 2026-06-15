import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/admin/sources" 
          className="block p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Sources</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Configure the web sources and domains used for knowledge discovery.
          </p>
        </Link>
      </div>
    </div>
  );
}
