export function toISODate(d: Date){
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const day = String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${day}`
}
export function startOfMonth(d: Date){ return new Date(d.getFullYear(), d.getMonth(), 1) }
export function endOfMonth(d: Date){ return new Date(d.getFullYear(), d.getMonth()+1, 0) }

export function getMonthMatrix(base: Date){
  // retorna 6 linhas x 7 colunas
  const first = startOfMonth(base)
  const start = new Date(first)
  const weekday = (first.getDay()+6)%7; // começa em segunda
  start.setDate(first.getDate()-weekday)

  const cells: Date[] = []
  for(let i=0;i<42;i++){
    const d = new Date(start); d.setDate(start.getDate()+i); cells.push(d)
  }
  return cells
}

export function ptMonthYear(d: Date){
  return d.toLocaleDateString('pt-BR', { month:'long', year:'numeric' })
}
