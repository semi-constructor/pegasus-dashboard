import { ReactNode } from "react";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/dashboard/DashboardLayout";

export default function PreviewLayout({ children }: { children: ReactNode }) {
  // Mock session for deterministic preview
  const session = {
    user: {
      id: "1162064293865463871",
      discordId: "1162064293865463871",
      name: "Tony",
      email: "tony@example.com",
      image: "/usr/tony.png"
    }
  };

  return (
    <DashboardLayoutComponent session={session as any} isAdmin={true}>
      {children}
    </DashboardLayoutComponent>
  );
}
