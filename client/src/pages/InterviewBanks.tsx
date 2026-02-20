import { useState } from 'react'
import Card from '../components/Card'
import { Library, ChevronRight } from 'lucide-react'
import { interviewBanks } from '../data/interviewBanks'

export default function InterviewBanks() {
  const [selected, setSelected] = useState<string | null>(null)

  const bank = selected ? interviewBanks.find((i) => i.id === selected) : null

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Industry-Specific Interview Banks</h1>
      <p className="mt-1 text-[var(--color-muted)]">Practice by industry: Tech, Finance, Consulting, Product, Healthcare</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interviewBanks.map((ind) => (
          <div
            key={ind.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(selected === ind.id ? null : ind.id)}
            onKeyDown={(e) => e.key === 'Enter' && setSelected(selected === ind.id ? null : ind.id)}
            className="cursor-pointer"
          >
            <Card className={`transition ${selected === ind.id ? 'ring-2 ring-[var(--color-primary)]' : 'hover:border-[var(--color-primary)]/40'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                    <Library className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{ind.name}</p>
                    <p className="text-sm text-[var(--color-muted)]">{ind.questions.length} questions</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[var(--color-muted)]" />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {bank && (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-white">
            All questions — {bank.name} ({bank.questions.length} total)
          </h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Scroll to see all questions.</p>
          <ul className="mt-4 max-h-[28rem] min-h-[8rem] list-decimal space-y-2 overflow-y-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] p-4 pl-8 text-sm text-[var(--color-muted)]">
            {bank.questions.length === 0 ? (
              <li>No questions loaded.</li>
            ) : (
              bank.questions.map((q, i) => (
                <li key={i} className="pl-1">
                  {q}
                </li>
              ))
            )}
          </ul>
        </Card>
      )}
    </div>
  )
}
