import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type NativeButtonProps = ButtonBaseProps &
  Omit<ComponentProps<"button">, "children" | "className"> & {
    loading?: boolean;
    loadingLabel?: ReactNode;
  };

type LinkButtonProps = ButtonBaseProps & {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type ButtonProps = NativeButtonProps | LinkButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-purple text-white not-disabled:hover:bg-purple-dark",
  secondary:
    "border border-lavender-dark text-purple not-disabled:hover:bg-lavender-light",
  danger: "border border-danger text-danger not-disabled:hover:bg-danger-light",
  ghost:
    "text-ink-soft not-disabled:hover:bg-lavender-light not-disabled:hover:text-purple",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
};

export function Button(props: ButtonProps) {
  if ("href" in props) {
    const {
      children,
      className = "",
      href,
      onClick,
      size = "md",
      variant = "primary",
    } = props;
    const classes = getButtonClasses(variant, size, className);

    return (
      <Link className={classes} href={href} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const {
    children,
    className = "",
    size = "md",
    variant = "primary",
    loading = false,
    loadingLabel = "Please wait...",
    disabled,
    ...buttonProps
  } = props;
  const classes = getButtonClasses(variant, size, className);

  return (
    <button
      {...buttonProps}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || buttonProps["aria-busy"]}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}

function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
) {
  return `control-interaction inline-flex items-center justify-center gap-2 rounded-full font-base font-bold ${
    variant === "danger"
      ? "focus-visible:outline-danger"
      : "focus-visible:outline-purple"
  } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}
