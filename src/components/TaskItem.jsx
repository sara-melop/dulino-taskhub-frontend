export default function TaskItem({ task, onEdit, onDelete, onToggle, deletingId, onConfirmDelete, onCancelDelete }) {
  const isConfirming = deletingId === task.id

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-800 dark:text-white text-base truncate ${task.done ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 break-words ${task.done ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${task.done ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
          {task.done ? 'Concluída' : 'Pendente'}
        </span>
      </div>
      {task.createdAt && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(task.createdAt).toLocaleDateString('pt-BR')}
        </p>
      )}
      {isConfirming ? (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">Excluir esta tarefa?</span>
          <button
            onClick={() => onConfirmDelete(task.id)}
            className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirmar
          </button>
          <button
            onClick={onCancelDelete}
            className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => onToggle(task.id, task.done)}
            className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {task.done ? 'Reabrir' : 'Concluir'}
          </button>
          <button
            onClick={() => onEdit(task)}
            className="text-xs px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 transition"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  )
}
