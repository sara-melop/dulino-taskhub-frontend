import { useState, useCallback } from 'react'
import api from '@/services/api'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFiltersState] = useState({ q: '', status: 'all' })

  const fetchTasks = useCallback(async (activeFilters = filters) => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (activeFilters.q) params.q = activeFilters.q
      if (activeFilters.status !== 'all') params.status = activeFilters.status
      const { data } = await api.get('/tasks', { params })
      setTasks(data.map((t) => ({ ...t, id: t.id ?? t._id })))
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }, [filters])

  async function createTask(taskData) {
    try {
      const { data } = await api.post('/tasks', taskData)
      setTasks((prev) => [{ ...data, id: data.id ?? data._id }, ...prev])
    } catch (err) {
      throw err.response?.data?.message ? new Error(err.response.data.message) : err
    }
  }

  async function updateTask(id, taskData) {
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...data, id } : t)))
    } catch (err) {
      throw err.response?.data?.message ? new Error(err.response.data.message) : err
    }
  }

  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      throw err.response?.data?.message ? new Error(err.response.data.message) : err
    }
  }

  async function toggleDone(id, done) {
    try {
      const { data } = await api.put(`/tasks/${id}`, { done: !done })
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...data, id } : t)))
    } catch (err) {
      throw err.response?.data?.message ? new Error(err.response.data.message) : err
    }
  }

  function setFilters(newFilters) {
    setFiltersState(newFilters)
    fetchTasks(newFilters)
  }

  return { tasks, loading, error, filters, fetchTasks, createTask, updateTask, deleteTask, toggleDone, setFilters }
}
