"use client";

import { useEffect, useState } from "react";

export default function LocalTime({ tz }: { tz: string }) {
  const [t, setT] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <span className="inline-block min-w-[11ch]">
      {t ? `${t} local time` : "\u00a0"}
    </span>
  );
}