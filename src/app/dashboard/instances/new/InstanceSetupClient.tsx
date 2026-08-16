"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bot, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface InstanceSetupClientProps {
  sessionId?: string;
  instanceId?: string;
}

export function InstanceSetupClient({ sessionId, instanceId }: InstanceSetupClientProps) {
  const t = useTranslations("setupInstance");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("/api/instances/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, sessionId, instanceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("setupFailed"));
      }

      toast.success(t("successMessage", { botName: data.botName }));
      router.push("/dashboard/instances"); 
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                {t("tokenLabel")}
              </label>
              <Input
                id="token"
                type="password"
                placeholder={t("tokenPlaceholder")}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground flex items-center mt-2">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {t("securityNote")}
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("btnProvisioning")}
                </span>
              ) : t("btnCreate")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
            {t("whereToFind")}
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
