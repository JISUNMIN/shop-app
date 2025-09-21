// src/components/ErrorMessage.tsx
import { FC } from "react";
import { Button } from "./ui/button";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: FC<ErrorMessageProps> = ({
  message = "데이터를 불러올 수 없습니다.",
  onRetry,
}) => {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            오류가 발생했습니다
          </h2>
          <p className="mt-2 text-muted-foreground">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} className="mt-4">
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
