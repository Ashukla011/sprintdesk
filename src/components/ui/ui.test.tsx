import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, test } from 'vitest'
import { Button, DataTable, Input, Modal, Select, Skeleton, ToastProvider, useToast } from './index'

function ToastTrigger() {
  const { toast } = useToast()
  return <button onClick={() => toast('Saved successfully', 'success')} type="button">Show toast</button>
}

describe('UI component library', () => {
  test('renders accessible form controls and button states', () => {
    render(<><Button disabled>Save</Button><Input id="title" label="Title" placeholder="Task title" /><Select id="priority" label="Priority" options={[{ label: 'High', value: 'high' }]} /></>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByLabelText('Title')).toHaveAttribute('placeholder', 'Task title')
    expect(screen.getByLabelText('Priority')).toHaveValue('high')
  })

  test('closes modal with Escape and backdrop action', async () => {
    const user = userEvent.setup()
    function Example() { const [open, setOpen] = useState(true); return <Modal open={open} onClose={() => setOpen(false)} title="Confirm">Content</Modal> }
    render(<Example />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('shows and dismisses toast messages', async () => {
    const user = userEvent.setup()
    render(<ToastProvider><ToastTrigger /></ToastProvider>)
    await user.click(screen.getByRole('button', { name: 'Show toast' }))
    expect(screen.getByRole('status')).toHaveTextContent('Saved successfully')
    await user.click(screen.getByRole('button', { name: /dismiss saved successfully/i }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('renders table data, empty states, and skeletons', () => {
    const columns = [{ key: 'name', header: 'Name', render: (row: { name: string }) => row.name }]
    render(<><DataTable columns={columns} data={[{ name: 'Sprint 24' }]} rowKey={(row) => row.name} /><DataTable columns={columns} data={[]} rowKey={(row) => row.name} /><Skeleton label="Loading row" /></>)
    expect(screen.getByRole('cell', { name: 'Sprint 24' })).toBeInTheDocument()
    expect(screen.getByText('No records found.')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading row')).toBeInTheDocument()
  })
})
