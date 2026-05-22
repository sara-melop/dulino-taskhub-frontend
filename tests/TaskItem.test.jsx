import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskItem from '../src/components/TaskItem'

const baseTask = {
  id: '1',
  title: 'Tarefa de teste',
  description: 'Descrição da tarefa',
  done: false,
  createdAt: '2024-01-01T00:00:00.000Z',
}

describe('TaskItem', () => {
  it('renderiza título e descrição', () => {
    render(<TaskItem task={baseTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText('Tarefa de teste')).toBeInTheDocument()
    expect(screen.getByText('Descrição da tarefa')).toBeInTheDocument()
  })

  it('renderiza badge Concluída quando done === true', () => {
    render(<TaskItem task={{ ...baseTask, done: true }} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={vi.fn()} />)
    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })

  it('clique em Concluir chama onToggle com id e done', () => {
    const onToggle = vi.fn()
    render(<TaskItem task={baseTask} onEdit={vi.fn()} onDelete={vi.fn()} onToggle={onToggle} />)
    fireEvent.click(screen.getByText('Concluir'))
    expect(onToggle).toHaveBeenCalledWith('1', false)
  })

  it('clique em Excluir chama onDelete com id', () => {
    const onDelete = vi.fn()
    render(<TaskItem task={baseTask} onEdit={vi.fn()} onDelete={onDelete} onToggle={vi.fn()} />)
    fireEvent.click(screen.getByText('Excluir'))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('clique em Editar chama onEdit com o objeto da tarefa', () => {
    const onEdit = vi.fn()
    render(<TaskItem task={baseTask} onEdit={onEdit} onDelete={vi.fn()} onToggle={vi.fn()} />)
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(baseTask)
  })
})
