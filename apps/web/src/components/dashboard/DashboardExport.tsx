import { useState } from 'react'
import { Button, Card } from '@fleet/ui-web'
import { useDashboardStore } from '../../stores/dashboardStore'
import { FileText, FileSpreadsheet, FileDown, Image } from 'lucide-react'

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'image'

interface ExportOptions {
  format: ExportFormat
  includeCharts: boolean
  includeRawData: boolean
  dateRange: boolean
}

export function DashboardExport() {
  const { dateRange, currentLayoutId, layouts } = useDashboardStore()
  const [isExporting, setIsExporting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeRawData: false,
    dateRange: true,
  })

  const currentLayout = layouts.find(l => l.id === currentLayoutId)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // TODO: Implement actual export logic based on format
      switch (options.format) {
        case 'pdf':
          await exportToPDF()
          break
        case 'excel':
          await exportToExcel()
          break
        case 'csv':
          await exportToCSV()
          break
        case 'image':
          await exportToImage()
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
      // TODO: Show error toast
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    // TODO: Implement PDF export using library like jsPDF or react-pdf
    console.log('Exporting to PDF...', { options, dateRange, currentLayout })
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('PDF export would be generated here')
  }

  const exportToExcel = async () => {
    // TODO: Implement Excel export using library like xlsx
    console.log('Exporting to Excel...', { options, dateRange, currentLayout })
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Excel export would be generated here')
  }

  const exportToCSV = async () => {
    // TODO: Implement CSV export
    console.log('Exporting to CSV...', { options, dateRange, currentLayout })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple CSV generation example
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Vehicles', '45'],
      ['Active Trips', '23'],
      ['Total Alerts', '5'],
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToImage = async () => {
    // TODO: Implement image export using html2canvas
    console.log('Exporting to Image...', { options, dateRange, currentLayout })
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Image export would be generated here')
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Export Dashboard</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? 'Hide' : 'Show'} Options
          </Button>
        </div>

        {/* Quick Export Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOptions({ ...options, format: 'pdf' })
              handleExport()
            }}
            disabled={isExporting}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOptions({ ...options, format: 'excel' })
              handleExport()
            }}
            disabled={isExporting}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5" />
            Excel
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOptions({ ...options, format: 'csv' })
              handleExport()
            }}
            disabled={isExporting}
          >
            <FileDown className="w-4 h-4 mr-1.5" />
            CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setOptions({ ...options, format: 'image' })
              handleExport()
            }}
            disabled={isExporting}
          >
            <Image className="w-4 h-4 mr-1.5" />
            Image
          </Button>
        </div>

        {/* Detailed Options */}
        {showOptions && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.includeCharts}
                  onChange={(e) =>
                    setOptions({ ...options, includeCharts: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                Include Charts
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.includeRawData}
                  onChange={(e) =>
                    setOptions({ ...options, includeRawData: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                Include Raw Data
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={options.dateRange}
                  onChange={(e) =>
                    setOptions({ ...options, dateRange: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                Include Date Range
              </label>
            </div>

            <Button
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? 'Exporting...' : 'Export with Options'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
