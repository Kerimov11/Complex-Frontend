export const STATIONS = [
  { value: 'KASSA_TELEFON', label: 'Kassa / Telefon' },
  { value: 'TURNIKET', label: 'Turniket' },
  { value: 'SEKTOR', label: 'Sektor' },
  { value: 'MIKRAFON', label: 'Mikrafon' },
  { value: 'BUZ', label: 'Buz' },
]

export function stationLabel(value) {
  return STATIONS.find((station) => station.value === value)?.label || 'Təyin edilməyib'
}
