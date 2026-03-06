import { useState } from 'react'
import { ChevronDown, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
  'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html',
  'css', 'json', 'yaml', 'markdown', 'bash', 'shell', 'plaintext',
]

interface CodeBlockViewProps {
  language: string
  code: string
  onLanguageChange: (lang: string) => void
}

export function CodeBlockView({ language, code, onLanguageChange }: CodeBlockViewProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState('')

  const filtered = LANGUAGES.filter((l) =>
    l.toLowerCase().includes(filter.toLowerCase()),
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="notion-code-header" contentEditable={false}>
      {/* Language selector */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-1 rounded px-2 py-1 font-mono text-xs text-notion-text-secondary transition-colors hover:bg-notion-bg-hover"
        >
          <span>{language || 'plaintext'}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {showPicker && (
          <div className="absolute top-full left-0 z-50 mt-1 max-h-48 w-44 overflow-y-auto rounded-lg border border-notion-border bg-notion-bg-secondary shadow-lg">
            <div className="sticky top-0 bg-notion-bg-secondary p-1.5">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter..."
                autoFocus
                className="w-full rounded bg-notion-bg-input px-2 py-1 font-mono text-xs text-notion-text-primary outline-none ring-1 ring-notion-border focus:ring-notion-green-primary"
              />
            </div>
            {filtered.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onLanguageChange(lang)
                  setShowPicker(false)
                  setFilter('')
                }}
                className={cn(
                  'w-full px-3 py-1.5 text-left font-mono text-xs transition-colors hover:bg-notion-bg-hover',
                  lang === language ? 'text-notion-green-primary' : 'text-notion-text-secondary',
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 rounded px-2 py-1 font-mono text-xs text-notion-text-muted transition-colors hover:bg-notion-bg-hover hover:text-notion-text-secondary"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            Copy
          </>
        )}
      </button>
    </div>
  )
}
