export interface CSVExportOptions {
  data: any[]
  columns: Array<{ header: string; dataKey: string; format?: (value: any) => string }>
  fileName?: string
  includeHeaders?: boolean
}

export class CSVExporter {
  private escapeCSVValue(value: any): string {
    if (value === null || value === undefined) {
      return ''
    }

    const stringValue = String(value)

    // If the value contains comma, newline, or double quote, wrap it in quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      // Escape double quotes by doubling them
      return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
  }

  exportToCSV(data: any[], columns: Array<{ header: string; dataKey: string; format?: (value: any) => string }>): string {
    const headers = columns.map(col => this.escapeCSVValue(col.header)).join(',')

    const rows = data.map(row => {
      return columns.map(col => {
        const value = row[col.dataKey]
        const formattedValue = col.format ? col.format(value) : value
        return this.escapeCSVValue(formattedValue)
      }).join(',')
    })

    return [headers, ...rows].join('\n')
  }

  downloadCSV(csvContent: string, fileName: string = 'export.csv'): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
}

export function exportToCSV(options: CSVExportOptions): void {
  const {
    data,
    columns,
    fileName = 'export.csv',
    includeHeaders = true,
  } = options

  const exporter = new CSVExporter()
  const csvContent = exporter.exportToCSV(data, columns)
  exporter.downloadCSV(csvContent, fileName)
}

export function convertToCSVString(data: any[], columns: Array<{ header: string; dataKey: string; format?: (value: any) => string }>): string {
  const exporter = new CSVExporter()
  return exporter.exportToCSV(data, columns)
}

export function exportMultiSheetCSV(
  sheets: Array<{
    name: string
    data: any[]
    columns: Array<{ header: string; dataKey: string; format?: (value: any) => string }>
  }>,
  fileName: string = 'export.csv'
): void {
  const exporter = new CSVExporter()

  // Combine multiple sheets with separators
  const content = sheets.map(sheet => {
    const sheetHeader = `\n=== ${sheet.name} ===\n`
    const sheetContent = exporter.exportToCSV(sheet.data, sheet.columns)
    return sheetHeader + sheetContent
  }).join('\n\n')

  exporter.downloadCSV(content, fileName)
}

// Common formatters for CSV export
export const csvFormatters = {
  date: (value: any) => {
    if (!value) return ''
    const date = new Date(value)
    return date.toLocaleDateString()
  },

  datetime: (value: any) => {
    if (!value) return ''
    const date = new Date(value)
    return date.toLocaleString()
  },

  currency: (value: any, currency: string = 'USD') => {
    if (value === null || value === undefined) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value)
  },

  number: (value: any, decimals: number = 2) => {
    if (value === null || value === undefined) return ''
    return Number(value).toFixed(decimals)
  },

  percentage: (value: any, decimals: number = 1) => {
    if (value === null || value === undefined) return ''
    return `${Number(value).toFixed(decimals)}%`
  },

  boolean: (value: any) => {
    return value ? 'Yes' : 'No'
  },

  array: (value: any, separator: string = '; ') => {
    if (!Array.isArray(value)) return ''
    return value.join(separator)
  },
}
