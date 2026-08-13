import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

import { getTranslations } from "next-intl/server";
import { TrackForm } from "./TrackForm";

export default async function LoginPage() {
  const t = await getTranslations("login");
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden text-foreground selection:bg-foreground selection:text-background">
      {/* Architectural lines */}
      <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
      <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-foreground/[0.03]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="border border-border bg-[#050505] p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-foreground/10" />
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center text-foreground/30 text-[10px] tracking-[0.3em] uppercase mb-8 border border-border px-3 py-1">
              // AUTHENTICATION
            </div>
            <h1 className="text-3xl font-medium tracking-tighter text-foreground uppercase mb-4">{t("welcomeTitle")}</h1>
            <p className="text-foreground/40 text-xs uppercase tracking-[0.2em]">
              {t("signInDescription")}
            </p>
          </div>

          <TrackForm>
            <form
              action={async () => {
                "use server";
                await signIn("discord", { redirectTo: "/dashboard" });
              }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-foreground hover:bg-zinc-200 text-background font-bold text-xs uppercase tracking-[0.3em] transition-all rounded-none flex items-center justify-center gap-3"
              >
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                {t("signInButton")}
              </Button>
            </form>
          </TrackForm>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-foreground/30 text-[10px] uppercase tracking-[0.3em]">
            <ShieldCheck className="w-3 h-3" />
            {t("secureAuth")}
          </div>
        </div>
      </div>
    </div>
  );
}
