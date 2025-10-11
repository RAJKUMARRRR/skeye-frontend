import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface PDFExportOptions {
  title: string
  subtitle?: string
  data: any[]
  columns: Array<{ header: string; dataKey: string }>
  fileName?: string
  orientation?: 'portrait' | 'landscape'
  includeTimestamp?: boolean
}

export class PDFExporter {
  private doc: jsPDF

  constructor(orientation: 'portrait' | 'landscape' = 'portrait') {
    this.doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    })
  }

  addHeader(title: string, subtitle?: string) {
    const pageWidth = this.doc.internal.pageSize.getWidth()

    // Add title
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, pageWidth / 2, 20, { align: 'center' })

    // Add subtitle if provided
    if (subtitle) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(subtitle, pageWidth / 2, 28, { align: 'center' })
    }

    return this
  }

  addTimestamp() {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const timestamp = new Date().toLocaleString()

    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(128, 128, 128)
    this.doc.text(`Generated: ${timestamp}`, pageWidth / 2, 35, { align: 'center' })
    this.doc.setTextColor(0, 0, 0)

    return this
  }

  addTable(data: any[], columns: Array<{ header: string; dataKey: string }>, startY: number = 40) {
    autoTable(this.doc, {
      startY,
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.dataKey] ?? '')),
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })

    return this
  }

  addSummarySection(title: string, data: Record<string, string | number>, yPosition?: number) {
    const startY = yPosition || (this.doc as any).lastAutoTable?.finalY + 15 || 40

    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, 14, startY)

    let currentY = startY + 8
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')

    Object.entries(data).forEach(([key, value]) => {
      this.doc.text(`${key}:`, 14, currentY)
      this.doc.text(String(value), 80, currentY)
      currentY += 6
    })

    return this
  }

  addPageNumbers() {
    const pageCount = this.doc.getNumberOfPages()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    const pageWidth = this.doc.internal.pageSize.getWidth()

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(9)
      this.doc.setTextColor(128, 128, 128)
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
      this.doc.setTextColor(0, 0, 0)
    }

    return this
  }

  save(fileName: string = 'report.pdf') {
    this.doc.save(fileName)
  }

  getBlob(): Blob {
    return this.doc.output('blob')
  }

  getBase64(): string {
    return this.doc.output('datauristring')
  }
}

export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const {
    title,
    subtitle,
    data,
    columns,
    fileName = 'report.pdf',
    orientation = 'portrait',
    includeTimestamp = true,
  } = options

  const exporter = new PDFExporter(orientation)

  exporter.addHeader(title, subtitle)

  if (includeTimestamp) {
    exporter.addTimestamp()
  }

  exporter.addTable(data, columns, includeTimestamp ? 45 : 40)
  exporter.addPageNumbers()
  exporter.save(fileName)
}

export async function exportMultiSectionPDF(
  title: string,
  sections: Array<{
    title: string
    data: any[]
    columns: Array<{ header: string; dataKey: string }>
    summary?: Record<string, string | number>
  }>,
  fileName: string = 'report.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<void> {
  const exporter = new PDFExporter(orientation)

  exporter.addHeader(title)
  exporter.addTimestamp()

  let startY = 45

  sections.forEach((section, index) => {
    if (index > 0) {
      startY = (exporter as any).doc.lastAutoTable?.finalY + 15 || startY + 50
    }

    // Add section title
    exporter.doc.setFontSize(14)
    exporter.doc.setFont('helvetica', 'bold')
    exporter.doc.text(section.title, 14, startY)

    startY += 8

    // Add table
    exporter.addTable(section.data, section.columns, startY)

    // Add summary if provided
    if (section.summary) {
      exporter.addSummarySection(
        `${section.title} Summary`,
        section.summary,
        (exporter as any).doc.lastAutoTable?.finalY + 10
      )
    }
  })

  exporter.addPageNumbers()
  exporter.save(fileName)
}
