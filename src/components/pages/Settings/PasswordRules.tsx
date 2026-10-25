import { Check, Circle } from "lucide-react"

export interface PasswordRule {
  label: string
  test: (v: string) => boolean
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  { label: "One special character (!@#$%^&*)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

export function isPasswordStrong(
  password: string,
  rules: PasswordRule[] = DEFAULT_PASSWORD_RULES
): boolean {
  if (!password) return false
  return rules.every((r) => r.test(password))
}

export function getPasswordStrength(
  password: string,
  rules: PasswordRule[] = DEFAULT_PASSWORD_RULES
) {
  const passedCount = rules.filter((r) => r.test(password)).length
  const percent = rules.length ? (passedCount / rules.length) * 100 : 0
  const color =
    percent <= 25
      ? "bg-rose-500"
      : percent <= 50
      ? "bg-amber-500"
      : percent <= 75
      ? "bg-blue-500"
      : "bg-emerald-500"

  const textLabel =
    percent <= 25
      ? "Weak"
      : percent <= 50
      ? "Moderate"
      : percent <= 75
      ? "Good"
      : "Strong"

  return {
    passedCount,
    totalRules: rules.length,
    percent,
    color,
    textLabel,
    isStrong: passedCount === rules.length,
  }
}

interface PasswordRulesProps {
  password?: string
  className?: string
  showBar?: boolean
  showList?: boolean
}

export function PasswordRules({
  password = "",
  className = "",
  showBar = true,
  showList = true,
}: PasswordRulesProps) {
  const { percent, color, textLabel } = getPasswordStrength(password)

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {showBar && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Password Strength</span>
            <span
              className={`font-medium ${
                percent <= 25
                  ? "text-rose-500"
                  : percent <= 50
                  ? "text-amber-500"
                  : percent <= 75
                  ? "text-blue-500"
                  : "text-emerald-500"
              }`}
            >
              {textLabel} ({Math.round(percent)}%)
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-muted/80 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${color}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {showList && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1" aria-label="Password requirements">
          {DEFAULT_PASSWORD_RULES.map((rule) => {
            const passed = rule.test(password)
            return (
              <li
                key={rule.label}
                className={`text-xs flex items-center gap-1.5 transition-colors duration-150 ${
                  passed
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground/70"
                }`}
              >
                {passed ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                )}
                <span>{rule.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
