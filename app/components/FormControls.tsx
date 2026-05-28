'use client';

import React from 'react';
import styles from './form.module.css';

/** Agrupa label + control con el espaciado estándar de la tarjeta clara. */
export function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label?: React.ReactNode;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      {label != null && (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${styles.input} ${className ?? ''}`} />;
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${styles.input} ${styles.textarea} ${className ?? ''}`}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${styles.input} ${className ?? ''}`}>
      {children}
    </select>
  );
}

export function SubmitButton({
  pending,
  pendingLabel,
  children,
  className,
  ...props
}: {
  pending?: boolean;
  pendingLabel?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      {...props}
      className={`${styles.btnPrimary} ${className ?? ''}`}
      disabled={pending}
    >
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}

export function FormError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className={styles.error}>{children}</div>;
}

export function FormSuccess({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className={styles.success}>{children}</div>;
}

export function CaptchaNote({ children }: { children?: React.ReactNode }) {
  return <p className={styles.captchaNote}>{children}</p>;
}
