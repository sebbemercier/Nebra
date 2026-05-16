import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AuthFormsProps {
  onLogin: (email: string, pass: string) => void
  onRegister: (email: string, name: string, pass: string) => void
  isPending: boolean
  error: Error | null
}

export function AuthForms({ onLogin, onRegister, isPending, error }: AuthFormsProps) {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="mb-4 grid gap-3 rounded-md border border-border/70 p-3 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-100">Login</p>
        <input
          className="w-full rounded-md border border-border/90 bg-muted/30 px-3 py-2 text-sm outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-md border border-border/90 bg-muted/30 px-3 py-2 text-sm outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => onLogin(email, password)}
          disabled={isPending || !email || !password}
        >
          Connect
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-100">Register</p>
        <input
          className="w-full rounded-md border border-border/90 bg-muted/30 px-3 py-2 text-sm outline-none"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Button
          onClick={() => onRegister(email, fullName, password)}
          disabled={isPending || !email || !fullName || !password}
        >
          Create account
        </Button>
      </div>
      {error && <p className="text-xs text-red-400 md:col-span-2">{error.message}</p>}
    </div>
  )
}
