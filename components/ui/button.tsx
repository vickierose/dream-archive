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
  Omit<ComponentProps<"button">, "children" | "className">;

type LinkButtonProps = ButtonBaseProps & {
  href: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type ButtonProps = NativeButtonProps | LinkButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-purple text-white hover:bg-purple-dark",
  secondary: "border border-lavender-dark text-purple hover:bg-lavender-light",
  danger: "border border-danger text-danger hover:bg-[#f8e7ea]",
  ghost: "text-ink-soft hover:bg-lavender-light hover:text-purple",
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
    ...buttonProps
  } = props;
  const classes = getButtonClasses(variant, size, className);

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
) {
  return `inline-flex items-center justify-center gap-2 rounded-full font-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 ${
    variant === "danger"
      ? "focus-visible:outline-danger"
      : "focus-visible:outline-purple"
  } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}
