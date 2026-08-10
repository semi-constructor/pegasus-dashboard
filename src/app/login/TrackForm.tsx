'use client';

import { sendGTMEvent } from "@next/third-parties/google";

export function TrackForm({ children }: { children: React.ReactNode }) {
  return (
    <div onClick={() => sendGTMEvent({ event: 'login_start', method: 'discord' })}>
      {children}
    </div>
  );
}
