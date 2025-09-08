export function Card({ children, className }) {
  return (
    <div className={`rounded-lg border p-4 shadow ${className || ""}`}>
      {children}
    </div>
  );
}
