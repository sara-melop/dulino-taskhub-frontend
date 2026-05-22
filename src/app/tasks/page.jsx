'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/hooks/useTasks'
import TaskItem from '@/components/TaskItem'
import TaskForm from '@/components/TaskForm'
import TaskFilter from '@/components/TaskFilter'
import WeatherWidget from '@/components/WeatherWidget'
import { useTheme } from '@/context/ThemeContext'

export default function TasksPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { tasks, loading, error, filters, fetchTasks, createTask, updateTask, deleteTask, toggleDone, setFilters } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [mutationError, setMutationError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    }
  }, [router, fetchTasks])

  function handleLogout() {
    localStorage.removeItem('token')
    router.replace('/login')
  }

  function handleOpenCreate() {
    setEditingTask(null)
    setShowForm(true)
  }

  function handleOpenEdit(task) {
    setEditingTask(task)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingTask(null)
  }

  async function handleSubmit(data) {
    setMutationError(null)
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data)
      } else {
        await createTask(data)
      }
      handleCloseForm()
    } catch (err) {
      setMutationError(err.message || 'Erro ao salvar tarefa')
    }
  }

  async function handleConfirmDelete(id) {
    setMutationError(null)
    try {
      await deleteTask(id)
    } catch (err) {
      setMutationError(err.message || 'Erro ao excluir tarefa')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">TaskHub</h1>
          <WeatherWidget />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className={`relative flex items-center w-20 h-8 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}
            >
              <span className={`absolute text-[10px] font-bold tracking-wide transition-opacity duration-200 ${theme === 'dark' ? 'left-2.5 text-white opacity-100' : 'opacity-0'}`}>
                NIGHT
              </span>
              <span className={`absolute text-[10px] font-bold tracking-wide transition-opacity duration-200 ${theme === 'dark' ? 'opacity-0' : 'right-2 text-gray-600 opacity-100'}`}>
                DAY
              </span>
              <span className={`absolute flex items-center justify-center w-7 h-7 rounded-full shadow-md transition-all duration-300 ${theme === 'dark' ? 'translate-x-[52px] bg-white text-gray-900' : 'translate-x-0.5 bg-white text-gray-700'}`}>
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                )}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Minhas Tarefas</h2>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
          >
            + Nova Tarefa
          </button>
        </div>

        <TaskFilter filters={filters} onChange={setFilters} />

        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Carregando...</p>}
        {(error || mutationError) && (
          <p className="text-center text-red-500">{mutationError || error}</p>
        )}

        {!loading && !error && tasks.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">Nenhuma tarefa encontrada.</p>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleOpenEdit}
              onDelete={setDeletingId}
              onToggle={toggleDone}
              deletingId={deletingId}
              onConfirmDelete={handleConfirmDelete}
              onCancelDelete={() => setDeletingId(null)}
            />
          ))}
        </div>
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
