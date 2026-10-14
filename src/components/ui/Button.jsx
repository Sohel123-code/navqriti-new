import { ArrowUpRight } from "lucide-react";
export default function Button({
  href,
  children,
  className = "",
  variant = "dark",
  arrow = true,
  ...props
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      className={`button button--${variant} ${className}`}
      {...props}
    >
      {children}
      {arrow && <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />}
    </Tag>
  );
}
