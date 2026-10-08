import { Feedback } from "@/components/ui/feedback";

type FormErrorProps = {
  id: string;
  message?: string;
};

export function FormError({ id, message }: FormErrorProps) {
  if (!message) return null;

  return (
    <Feedback id={id} className="mt-2">
      {message}
    </Feedback>
  );
}
