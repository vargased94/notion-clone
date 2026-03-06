import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Table, X } from 'lucide-react'

interface ImportModalProps {
  onImportMarkdown: (content: string) => void
  onImportCsv: (rows: string[][]) => void
}

function parseCsv(text: string): string[][] {
  const lines = text.split('\n').filter((l) => l.trim().length > 0)
  return lines.map((line) => {
    const cells: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        cells.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    cells.push(current.trim())
    return cells
  })
}

export function ImportModal({ onImportMarkdown, onImportCsv }: ImportModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setError(null)
      const reader = new FileReader()

      reader.onload = () => {
        const content = reader.result as string

        if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
          onImportMarkdown(content)
          setIsOpen(false)
        } else if (file.name.endsWith('.csv')) {
          const rows = parseCsv(content)
          if (rows.length === 0) {
            setError('CSV file is empty')
            return
          }
          onImportCsv(rows)
          setIsOpen(false)
        } else {
          setError('Unsupported file type. Use .md or .csv files.')
        }
      }

      reader.onerror = () => {
        setError('Failed to read file')
      }

      reader.readAsText(file)

      // Reset input so the same file can be re-selected
      e.target.value = ''
    },
    [onImportMarkdown, onImportCsv],
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
        title="Import"
      >
        <Upload className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-[400px] rounded-xl border border-notion-border bg-notion-bg-secondary p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-notion-text-primary">
                Import
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-notion-text-muted hover:bg-notion-bg-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 font-mono text-xs text-notion-text-muted">
              Import content from Markdown or CSV files.
            </p>

            {/* Upload area */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.csv"
              onChange={handleFile}
              className="hidden"
            />

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = '.md,.markdown'
                    fileInputRef.current.click()
                  }
                }}
                className="flex items-center gap-3 rounded-lg border border-notion-border p-4 transition-colors hover:bg-notion-bg-hover"
              >
                <FileText className="h-5 w-5 text-notion-text-muted" />
                <div className="text-left">
                  <span className="block font-mono text-xs font-medium text-notion-text-primary">
                    Markdown
                  </span>
                  <span className="block font-mono text-[10px] text-notion-text-muted">
                    .md files — headings, lists, links, code
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = '.csv'
                    fileInputRef.current.click()
                  }
                }}
                className="flex items-center gap-3 rounded-lg border border-notion-border p-4 transition-colors hover:bg-notion-bg-hover"
              >
                <Table className="h-5 w-5 text-notion-text-muted" />
                <div className="text-left">
                  <span className="block font-mono text-xs font-medium text-notion-text-primary">
                    CSV
                  </span>
                  <span className="block font-mono text-[10px] text-notion-text-muted">
                    .csv files — import as database table
                  </span>
                </div>
              </button>
            </div>

            {error && (
              <p className="mt-3 font-mono text-xs text-red-400">{error}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
