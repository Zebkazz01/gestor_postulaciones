"use client";

import { Check, X } from "@phosphor-icons/react";

interface PasswordStrengthCheckerProps {
  password: string;
}

export function PasswordStrengthChecker({
  password,
}: PasswordStrengthCheckerProps) {
  if (!password) return null;

  const checks = [
    { label: "Al menos 8 caracteres", valid: password.length >= 8 },
    { label: "Una letra mayúscula (A-Z)", valid: /[A-Z]/.test(password) },
    { label: "Una letra minúscula (a-z)", valid: /[a-z]/.test(password) },
    { label: "Un número (0-9)", valid: /[0-9]/.test(password) },
    {
      label: "Un carácter especial (!@#$%^&*)",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passedCount = checks.filter((c) => c.valid).length;
  const percentage = (passedCount / checks.length) * 100;

  let strengthLabel = "Muy débil";
  let barColor = "bg-red-500";
  let textColor = "text-red-500";

  if (passedCount >= 5) {
    strengthLabel = "Muy fuerte";
    barColor = "bg-emerald-500";
    textColor = "text-emerald-500";
  } else if (passedCount >= 4) {
    strengthLabel = "Fuerte";
    barColor = "bg-green-500";
    textColor = "text-green-500";
  } else if (passedCount >= 3) {
    strengthLabel = "Media";
    barColor = "bg-yellow-500";
    textColor = "text-yellow-500";
  } else if (passedCount >= 2) {
    strengthLabel = "Débil";
    barColor = "bg-orange-500";
    textColor = "text-orange-500";
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-3 text-xs">
      <div className="flex items-center justify-between font-medium">
        <span className="text-muted-foreground">Seguridad de contraseña:</span>
        <span className={textColor}>{strengthLabel}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="grid gap-1 sm:grid-cols-2 pt-1">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`flex items-center gap-1.5 transition-colors ${
              check.valid
                ? "text-emerald-500 dark:text-emerald-400 font-medium"
                : "text-muted-foreground/70"
            }`}
          >
            {check.valid ? (
              <Check className="h-3.5 w-3.5 shrink-0" weight="bold" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
