import { FC } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "@/context/TranslationContext";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  const t = useTranslation();
  return (
    <div className="container py-8">
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            {t.errorOccurred}
          </h2>
          <p className="mt-2 text-muted-foreground">{message ?? t.cannotLoadData}</p>
          {onRetry && (
            <Button onClick={onRetry} className="mt-4">
              {t.retry}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
