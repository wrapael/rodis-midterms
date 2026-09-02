import { useState } from 'react'
import { Box, Button, Card, CardContent, Container, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import './App.css'

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Audio']
const emptyForm = { gadgetName: '', category: '', manufacturer: '', healthRating: '', techBrand: '', role: '' }
const columns = [
  { accessorKey: 'gadgetName', header: 'Gadget' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'manufacturer', header: 'Manufacturer' },
  { accessorKey: 'healthRating', header: 'Health' },
  { accessorKey: 'role', header: 'Role' },
]

function App() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [gadgets, setGadgets] = useState([])
  const [selectedGadget, setSelectedGadget] = useState(null)

  function validateForm() {
    const rating = Number(form.healthRating)
    if (form.gadgetName.trim().length < 3) return { gadgetName: 'Enter at least 3 characters.' }
    else if (form.category === '') return { category: 'Select a category.' }
    else if (form.manufacturer.trim() === '') return { manufacturer: 'Manufacturer is required.' }
    else if (form.healthRating === '' || rating < 1 || rating > 100) return { healthRating: 'Enter a rating from 1 to 100.' }
    else if (form.techBrand.trim() === '') return { techBrand: 'Tech brand is required.' }
    else if (form.role === '') return { role: 'Select a user role.' }
    return {}
  }

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const newForm = { ...form, [name]: value }
    setForm(newForm)
    setErrors(validateField(name, value))
  }

  function validateField(name, value) {
    if (name === 'gadgetName' && value.trim().length < 3) return { gadgetName: 'Enter at least 3 characters.' }
    else if (name === 'category' && value === '') return { category: 'Select a category.' }
    else if (name === 'manufacturer' && value.trim() === '') return { manufacturer: 'Manufacturer is required.' }
    else if (name === 'healthRating' && (value === '' || Number(value) < 1 || Number(value) > 100)) return { healthRating: 'Enter a rating from 1 to 100.' }
    else if (name === 'techBrand' && value.trim() === '') return { techBrand: 'Tech brand is required.' }
    else if (name === 'role' && value === '') return { role: 'Select a user role.' }
    return {}
  }

  function handleSubmit() {
    const formErrors = validateForm()
    setErrors(formErrors)
    if (Object.keys(formErrors).length > 0) return
    const newGadget = { ...form, id: Date.now(), healthRating: Number(form.healthRating) }
    setGadgets([...gadgets, newGadget])
    setSelectedGadget(newGadget)
    setForm(emptyForm)
    setErrors({})
  }

  const table = useReactTable({
    data: gadgets,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 3 } },
  })

  return (
    <Box className="app-shell"><Container>
      <header className="page-header">
        <Typography className="student-label">INF231 - John Rafael Rodis</Typography>
        <Typography variant="h4" component="h1">Tech Gadget Inventory Hub</Typography>
      </header>
      <Card className="panel form-panel"><CardContent>
        <div className="section-heading"><Typography variant="h6">Add Gadget</Typography><span>{gadgets.length} gadgets</span></div>
        <Stack>
          <TextField label="Gadget name" name="gadgetName" value={form.gadgetName} onChange={handleChange} error={Boolean(errors.gadgetName)} helperText={errors.gadgetName || 'At least 3 characters'} />
          <TextField select label="Category" name="category" value={form.category} onChange={handleChange} error={Boolean(errors.category)} helperText={errors.category}>{categories.map(function (category) { return <MenuItem key={category} value={category}>{category}</MenuItem> })}</TextField>
          <TextField label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} error={Boolean(errors.manufacturer)} helperText={errors.manufacturer} />
          <TextField type="number" label="Health rating" name="healthRating" value={form.healthRating} onChange={handleChange} error={Boolean(errors.healthRating)} helperText={errors.healthRating || 'From 1 to 100'} slotProps={{ htmlInput: { min: 1, max: 100 } }} />
          <TextField label="Tech brand name" name="techBrand" value={form.techBrand} onChange={handleChange} error={Boolean(errors.techBrand)} helperText={errors.techBrand} />
          <FormControl error={Boolean(errors.role)}><FormLabel>User role</FormLabel><RadioGroup row name="role" value={form.role} onChange={handleChange}><FormControlLabel value="Engineer" control={<Radio />} label="Engineer" /><FormControlLabel value="Tester" control={<Radio />} label="Tester" /></RadioGroup>{errors.role && <FormHelperText>{errors.role}</FormHelperText>}</FormControl>
          <Button className="add-button" variant="contained" onClick={handleSubmit}>Add gadget</Button>
        </Stack>
      </CardContent></Card>
      <Card className="panel"><CardContent>
        <div className="registry-heading"><Typography variant="h6">Gadget List</Typography></div>
        <div className="table-wrap">
          <table>
            <thead>{table.getHeaderGroups().map(function (group) {
              return <tr key={group.id}>{group.headers.map(function (header) {
                return <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
              })}</tr>
            })}</thead>
            <tbody>{table.getRowModel().rows.map(function (row) {
              const selected = selectedGadget && selectedGadget.id === row.original.id
              return <tr key={row.id} className={selected ? 'selected-row' : ''} onClick={function () { setSelectedGadget(row.original) }}>{row.getVisibleCells().map(function (cell) {
                return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              })}</tr>
            })}</tbody>
          </table>
          {gadgets.length === 0 && <div className="empty-state">No gadgets found.</div>}
        </div>
        <div className="pagination">
          <span>Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}</span>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={table.previousPage} disabled={!table.getCanPreviousPage()}>Previous</Button>
            <Button variant="outlined" onClick={table.nextPage} disabled={!table.getCanNextPage()}>Next</Button>
          </Stack>
        </div>
      </CardContent></Card>
    </Container></Box>
  )
}

export default App
