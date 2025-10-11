import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@fleet/ui-web'
import { BulkImportModal } from '../features/vehicles/components/BulkImportModal'

export function VehicleBulkImport() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(true)

  const handleImport = async (file: File) => {
    // TODO: Implement actual CSV parsing and vehicle creation
    console.log('Importing file:', file.name)

    // Parse CSV and create vehicles
    // For now, just simulate the import
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Navigate back to vehicles list
    navigate('/vehicles')
  }

  const handleClose = () => {
    setShowModal(false)
    navigate('/vehicles')
  }

  return (
    <>
      {showModal && (
        <BulkImportModal onClose={handleClose} onImport={handleImport} />
      )}
    </>
  )
}
