import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
  color?: "primary" | "secondary" | "danger" | "edit";
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
    primary: "bg-primary hover:bg-secondary text-white",
    secondary: "bg-secondary hover:bg-primary text-white",
    danger: "bg-danger hover:bg-hoverDanger text-white",
    edit: "bg-edit hover:bg-hoverEdit text-white",
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
