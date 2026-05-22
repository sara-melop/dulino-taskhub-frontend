import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskForm from '../src/components/TaskForm'

describe('TaskForm', () => {
  it('renderiza campos de título e descrição', () => {
    render(<TaskForm task={null} onSubmit={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
  })

  it('botão Salvar desabilitado quando título vazio', () => {
    render(<TaskForm task={null} onSubmit={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled()
  })

  it('preencher e submeter chama onSubmit com os dados corretos', () => {
    const onSubmit = vi.fn()
    render(<TaskForm task={null} onSubmit={onSubmit} onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nova tarefa' } })
    fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: 'Minha descrição' } })
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Nova tarefa', description: 'Minha descrição' })
  })

  it('botão Cancelar chama onClose', () => {
    const onClose = vi.fn()
    render(<TaskForm task={null} onSubmit={vi.fn()} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('em modo edição campos pré-preenchidos com dados da tarefa', () => {
    const task = { id: '1', title: 'Tarefa existente', description: 'Desc existente' }
    render(<TaskForm task={task} onSubmit={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByLabelText(/título/i)).toHaveValue('Tarefa existente')
    expect(screen.getByLabelText(/descrição/i)).toHaveValue('Desc existente')
  })
})
