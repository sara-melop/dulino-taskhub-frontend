export default function TaskFilter({ filters, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label htmlFor="filter-search" className="sr-only">Buscar por título</label>
        <input
          id="filter-search"
          type="text"
          placeholder="Buscar por título..."
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      <div>
        <label htmlFor="filter-status" className="sr-only">Filtrar por status</label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="done">Concluídos</option>
        </select>
      </div>
    </div>
  )
}
