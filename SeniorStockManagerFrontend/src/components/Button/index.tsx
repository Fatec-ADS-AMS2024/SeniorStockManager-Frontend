import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
  color?: "primary" | "secondary" | "success" | "danger" | "edit" | "confirmation" | "textSecondary" | "neutralLight";
  size?: "small" | "medium" | "large";
}

export default function Button({
  label,
  icon,
  iconPosition = "left",
  color = "primary",
  size = "medium",
  className,
  ...props
}: ButtonProps) {
  const colorClasses = {
    primary: "bg-primary hover:bg-secondary text-neutralWhite",
    secondary: "bg-secondary hover:bg-primary text-neutralWhite",
    success: "bg-success hover:bg-hoverSuccess text-neutralWhite",
    danger: "bg-danger hover:bg-hoverDanger text-neutralWhite",
    edit: "bg-edit hover:bg-hoverEdit text-neutralWhite",
    confirmation: "bg-confirmation hover:bg-hoverConfirmation text-neutralWhite",
    textSecondary: "bg-textSecondary hover:bg-hoverConfirmation text-neutralWhite",
    neutralLight: "bg-neutralLight hover:bg-neutralDark text-textPrimary",
  };

  const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-6 py-2 text-base",
    large: "px-7 py-2 text-lg",
  };

  return (
    <button
      className={`flex items-center justify-center gap-1 rounded-sm transition ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {iconPosition === "left" && <span>{icon}</span>}
      <span>{label}</span>
      {iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}