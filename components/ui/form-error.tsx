type FormErrorProps = {
  id: string;
  message?: string;
};

export function FormError({ id, message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-2 font-base text-xs text-danger">
      {message}
    </p>
  );
}
