import type { FormHTMLAttributes } from "react";

type FormProps = FormHTMLAttributes<HTMLFormElement>;

/** Shared semantic form wrapper for consistent form spacing and accessibility. */
export function Form({ className = "", ...props }: FormProps) {
  return <form className={`space-y-4 ${className}`} {...props} />;
}
