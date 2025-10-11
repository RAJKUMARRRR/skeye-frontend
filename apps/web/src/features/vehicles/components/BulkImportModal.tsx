import { useState, useRef } from 'react'
import { Button, Card } from '@fleet/ui-web'

interface BulkImportModalProps {
  onClose: () => void
  onImport: (file: File) => Promise<void>
}

export function BulkImportModal({ onClose, onImport }: BulkImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      await onImport(file)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import vehicles')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      ['licensePlate', 'vin', 'make', 'model', 'year', 'type', 'odometer', 'deviceId'],
      ['ABC-1234', '1HGBH41JXMN109186', 'Toyota', 'Camry', '2023', 'sedan', '15000', 'device-001'],
      ['XYZ-5678', '2HGFC2F53PH123456', 'Honda', 'Accord', '2022', 'sedan', '25000', 'device-002'],
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vehicle-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl p-6 m-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Bulk Import Vehicles</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong>
              </p>
              <ul className="text-sm text-blue-700 list-disc list-inside mt-2 space-y-1">
                <li>Download the CSV template</li>
                <li>Fill in your vehicle data</li>
                <li>Upload the completed CSV file</li>
                <li>Required fields: licensePlate, make, model, type</li>
              </ul>
            </div>

            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              📥 Download CSV Template
            </Button>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload CSV File
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  {file ? file.name : 'Choose File'}
                </Button>
                {file && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
              {file && (
                <p className="text-sm text-gray-600">
                  File size: {(file.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? 'Importing...' : 'Import Vehicles'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
