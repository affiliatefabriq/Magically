"use client";

import {useSearchParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {AlertCircle} from "lucide-react";
import api from "@/lib/api";

const PaymentFailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Pages.Payment");
  const paymentId = searchParams.get("payment_id");
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    // Получаем информацию о платеже, если payment_id указан
    const fetchPayment = async () => {
      if (paymentId) {
        try {
          const {data} = await api.get(`/payment/${paymentId}`);
          setPayment(data.data.payment);
        } catch (error) {
          console.error("Failed to fetch payment:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  return (
    <div className="section-padding">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="w-20 h-20 text-red-500"/>
          <h1 className="title-text text-center">
            {t("Fail.Title") || "Ошибка платежа"}
          </h1>
          <p className="text-muted-foreground text-center max-w-md">
            {t("Fail.Description") || "Произошла ошибка при обработке платежа. Пожалуйста, попробуйте еще раз или свяжитесь с поддержкой."}
          </p>
          {payment && (
            <div className="mt-4 p-4 border rounded-xl theme w-full max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Сумма:</span>
                <span className="font-bold">{payment.amount} {payment.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ID платежа:</span>
                <span className="text-sm font-mono">{payment.id.slice(0, 8)}...</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            onClick={() => router.push("/pay")}
            className="w-full"
          >
            {t("Fail.TryAgain") || "Попробовать еще раз"}
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="w-full"
            variant="outline"
          >
            {t("Fail.BackToHome") || "Вернуться на главную"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;

