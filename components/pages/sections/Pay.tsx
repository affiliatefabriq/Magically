"use client";

import { useTranslations } from "next-intl";
import Script from "next/script";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NotAuthorized } from "@/components/states/error/Error";
import { useUser } from "@/hooks/useAuth";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PayFormValues, paySchema } from "@/lib/validation";
import api from "@/lib/api";
import {BeGatewayParams, BeGatewayStatus} from "@/types";

// Функция для создания платежа с токеном
const createPaymentWithToken = async (amount: number, currency: string = "RUB") => {
  const { data } = await api.post("/payment/token", {
    amount,
    currency,
    paymentMethod: "card",
    paymentProvider: "bepaid",
    description: `Пополнение баланса на ${amount} ${currency}`,
  });
  return data.data; // { payment, paymentToken, redirectUrl }
};

export const Pay = () => {
  const t = useTranslations("Pages.Pay");
  const { data: user } = useUser();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [currency, setCurrency] = useState<string>("RUB"); // Дефолтная валюта
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(true);
  const [tokens, setTokens] = useState<number | null>(null);
  const [isTokensLoading, setIsTokensLoading] = useState(false);
  const widgetInitialized = useRef(false);

  const form = useForm<PayFormValues>({
    resolver: zodResolver(paySchema),
    defaultValues: {
      amount: 10
    },
  });

  // Отслеживаем изменения суммы для расчета токенов
  const amount = form.watch("amount");

  // Получаем валюту по IP при загрузке компонента
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        setIsCurrencyLoading(true);
        const { data } = await api.get("/payment/currency");
        
        if (data.data?.currency) {
          setCurrency(data.data.currency);
        }
      } catch (err) {
        console.error("Error fetching currency:", err);
        // Оставляем дефолтную валюту RUB в случае ошибки
      } finally {
        setIsCurrencyLoading(false);
      }
    };

    fetchCurrency();
  }, []);

  // Рассчитываем количество токенов при изменении суммы или валюты
  useEffect(() => {
    // Не делаем запрос если сумма не валидна или валюта еще загружается
    if (!amount || amount <= 0 || isCurrencyLoading || !currency) {
      setTokens(null);
      return;
    }

    // Добавляем небольшую задержку для debounce (чтобы не делать запрос при каждом изменении)
    const timeoutId = setTimeout(async () => {
      try {
        setIsTokensLoading(true);
        const { data } = await api.get("/payment/tokens/calculate", {
          params: {
            amount,
            currency,
          },
        });

        if (data.data?.tokens !== undefined) {
          setTokens(data.data.tokens);
        }
      } catch (err) {
        console.error("Error calculating tokens:", err);
        setTokens(null);
      } finally {
        setIsTokensLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [amount, currency, isCurrencyLoading]);

  // Инициализация bePaid виджета
  const initBePaidWidget = (token: string) => {
    if (!window.BeGateway || widgetInitialized.current) {
      return;
    }

    widgetInitialized.current = true;

    // Определяем, находимся ли мы в WebView (например, Telegram WebApp)
    const isWebView = typeof window !== "undefined" && 
      (window as any)?.Telegram?.WebApp !== undefined;

    // Определяем тестовый режим из переменной окружения (по умолчанию false)
    const isTestMode = process.env.NEXT_PUBLIC_BEPAID_TEST === "true" || process.env.NEXT_PUBLIC_BEPAID_TEST === "1";

    const params: BeGatewayParams = {
      checkout_url: "https://checkout.bepaid.by",
      fromWebview: isWebView,
      checkout: {
        iframe: true,
        test: isTestMode,
        transaction_type: "payment"
      },
      token: token,
      closeWidget: (status: BeGatewayStatus | null) => {
        widgetInitialized.current = false;
        
        if (status === "successful") {
          setMessage("Платеж успешно выполнен!");
          setError("");
          form.reset();
        } else if (status === "failed") {
          setError("Платеж не был выполнен. Попробуйте еще раз.");
          setMessage("");
        } else if (status === "pending") {
          setMessage("Ожидаем подтверждение платежа...");
          setError("");
        } else if (status === "redirected") {
          setMessage("Вы были перенаправлены на внешнюю платежную систему.");
          setError("");
        } else if (status === "error") {
          setError("Произошла ошибка при обработке платежа.");
          setMessage("");
        } else if (status === null) {
          // Виджет закрыт без запуска оплаты
          setError("");
          setMessage("");
        }
      }
    };

    try {
      new window.BeGateway!(params).createWidget();
    } catch (err) {
      console.error("Error initializing bePaid widget:", err);
      setError("Не удалось открыть платежный виджет. Попробуйте еще раз.");
      widgetInitialized.current = false;
    }
  };

  const onSubmit = async (values: PayFormValues) => {
    setError("");
    setMessage("");
    setIsLoading(true);
    widgetInitialized.current = false;

    try {
      // Получаем токен платежа от backend с определенной валютой
      const result = await createPaymentWithToken(values.amount, currency);
      
      if (!result.paymentToken) {
        throw new Error("Токен платежа не получен");
      }

      // Ждем загрузки скрипта bePaid, если он еще не загружен
      if (!isScriptLoaded) {
        // Если скрипт еще загружается, ждем немного
        const checkScript = setInterval(() => {
          if (window.BeGateway) {
            setIsScriptLoaded(true);
            clearInterval(checkScript);
            initBePaidWidget(result.paymentToken);
            setIsLoading(false);
          }
        }, 100);

        // Таймаут на случай, если скрипт не загрузится
        setTimeout(() => {
          clearInterval(checkScript);
          if (!window.BeGateway) {
            setError("Не удалось загрузить платежный виджет. Обновите страницу.");
            setIsLoading(false);
          }
        }, 5000);
      } else {
        // Скрипт уже загружен, сразу инициализируем виджет
        initBePaidWidget(result.paymentToken);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.response?.data?.message || err.message || "Не удалось создать платеж. Попробуйте еще раз.");
      setIsLoading(false);
      widgetInitialized.current = false;
    }
  };

  // Обработчик загрузки скрипта bePaid
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  if (!user)
    return (
      <div className="state-center">
        <NotAuthorized />
      </div>
    );

  return (
    <>
      {/* Подключение скрипта bePaid виджета */}
      <Script
        src="https://js.bepaid.by/widget/be_gateway.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={() => {
          setError("Не удалось загрузить платежный виджет. Обновите страницу.");
        }}
      />
      
      <div className="section-padding">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-6 rounded-xl max-w-md mx-auto">
            <h1 className="title-text">{t("Title")}</h1>
            {!message ? (
              <>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("AmountLabel")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            disabled={isLoading}
                            className="pr-16"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            {isCurrencyLoading ? "..." : currency}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading || !isScriptLoaded || isCurrencyLoading || isTokensLoading}>
                  {isLoading || isCurrencyLoading || isTokensLoading ? (
                    "Загрузка..."
                  ) : (
                    <>
                      {t("Button.Pay")}
                      {tokens !== null && (
                        <span className="ml-2 text-sm opacity-75">
                          ({tokens} {tokens === 1 ? "токен" : tokens < 5 ? "токена" : "токенов"})
                        </span>
                      )}
                      {isTokensLoading && tokens === null && (
                        <span className="ml-2 text-sm opacity-75">...</span>
                      )}
                    </>
                  )}
                </Button>
                {error && <p className="text-center text-red-500">{error}</p>}
                {!isScriptLoaded && !error && (
                  <p className="text-center text-gray-500 text-sm">Загрузка платежного виджета...</p>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-green-500">{message}</p>
                <Button 
                  type="button" 
                  className="w-full" 
                  onClick={() => {
                    setMessage("");
                    setError("");
                    form.reset();
                  }}
                >
                  Создать новый платеж
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
};
