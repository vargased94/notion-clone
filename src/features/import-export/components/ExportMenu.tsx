import { useState } from 'react'
import { Download, FileText, Code } from 'lucide-react'

interface ExportMenuProps {
  pageTitle: string
  getEditorHtml: () => string
  getEditorText: () => string
}

function htmlToMarkdown(html: string): string {
  let md = html
  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
  // Bold / Italic / Code
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*')
  md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`')
  // Links
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
  // Lists
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
  md = md.replace(/<\/?[uo]l[^>]*>/gi, '\n')
  // Paragraphs and breaks
  md = md.replace(/<br\s*\/?>/gi, '\n')
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, '---\n\n')
  // Strip remaining tags
  md = md.replace(/<[^>]+>/g, '')
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n').trim()
  return md
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ExportMenu({ pageTitle, getEditorHtml, getEditorText }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const safeName = (pageTitle || 'Untitled').replace(/[^a-zA-Z0-9-_ ]/g, '').trim()

  const handleExportMarkdown = () => {
    const html = getEditorHtml()
    const md = `# ${pageTitle || 'Untitled'}\n\n${htmlToMarkdown(html)}`
    downloadFile(md, `${safeName}.md`, 'text/markdown')
    setIsOpen(false)
  }

  const handleExportHtml = () => {
    const html = getEditorHtml()
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle || 'Untitled'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #37352f; }
    h1, h2, h3 { font-weight: 600; }
    code { background: #f7f6f3; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.85em; }
    pre { background: #f7f6f3; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    blockquote { border-left: 3px solid #e3e2de; margin: 0; padding-left: 1rem; color: #6b6b6b; }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #e3e2de; padding: 0.5rem; text-align: left; }
    th { background: #f7f6f3; }
  </style>
</head>
<body>
  <h1>${pageTitle || 'Untitled'}</h1>
  ${html}
</body>
</html>`
    downloadFile(fullHtml, `${safeName}.html`, 'text/html')
    setIsOpen(false)
  }

  const handleExportText = () => {
    const text = getEditorText()
    downloadFile(`${pageTitle || 'Untitled'}\n\n${text}`, `${safeName}.txt`, 'text/plain')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded p-1 text-notion-text-muted transition-colors hover:bg-notion-bg-hover"
        title="Export"
      >
        <Download className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 z-50 mt-1 w-[200px] rounded-xl border border-notion-border bg-notion-bg-secondary p-1 shadow-xl">
            <div className="px-2 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-notion-text-muted">
              EXPORT AS
            </div>
            <button
              onClick={handleExportMarkdown}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs text-notion-text-secondary transition-colors hover:bg-notion-bg-hover"
            >
              <FileText className="h-3.5 w-3.5" />
              Markdown
            </button>
            <button
              onClick={handleExportHtml}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs text-notion-text-secondary transition-colors hover:bg-notion-bg-hover"
            >
              <Code className="h-3.5 w-3.5" />
              HTML
            </button>
            <button
              onClick={handleExportText}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs text-notion-text-secondary transition-colors hover:bg-notion-bg-hover"
            >
              <FileText className="h-3.5 w-3.5" />
              Plain text
            </button>
          </div>
        </>
      )}
    </div>
  )
}
