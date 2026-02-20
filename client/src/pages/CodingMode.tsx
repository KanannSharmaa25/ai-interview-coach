import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { Play, Square, RotateCcw } from 'lucide-react'

export default function CodingMode() {
  const [code, setCode] = useState('function twoSum(nums, target) {\n  // Your code here\n  return [];\n}')
  const [timeLeft] = useState(45 * 60) // 45 min

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col p-6 lg:p-8">
      <h1 className="text-xl font-bold text-white">Real-Time Coding Interview</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Code editor · AI evaluates logic · Time-based tests</p>

      <div className="mt-4 flex flex-1 gap-4 overflow-hidden">
        <Card className="flex-1 flex flex-col overflow-hidden" padding="none">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
            <span className="text-sm text-[var(--color-muted)]">Problem: Two Sum</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-white">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              <Button variant="ghost" size="sm"><Play className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><Square className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><RotateCcw className="h-4 w-4" /></Button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 resize-none bg-[var(--color-surface)] p-4 font-mono text-sm text-white focus:outline-none"
            spellCheck={false}
          />
          <div className="border-t border-[var(--color-border)] px-4 py-2">
            <Button variant="primary" size="sm">Run tests</Button>
          </div>
        </Card>
        <Card className="w-80 shrink-0 overflow-auto">
          <h2 className="text-sm font-semibold text-white">Problem</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
          </p>
          <h3 className="mt-4 text-sm font-semibold text-white">AI evaluation</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Submit your solution to get logic and efficiency feedback.</p>
        </Card>
      </div>
    </div>
  )
}
