// app/[slug]/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/axios";
import { Log } from "@/app/utils/logger";

type Props = {
  params: { slug: string };
};

export default function RedirectPage({ params }: Props) {
  const router = useRouter();

  useEffect(() => {
    async function fetchOriginalUrl() {
      try {
        const res = await api.get(`/resolve/${params.slug}`);
        const { longUrl } = res.data;
        window.location.href = longUrl;
      }  catch (error: any) {
        await Log("frontend", "error", "network", "Redirect failed");
        router.push("/"); // fallback
      }
    }

    fetchOriginalUrl();
  }, [params.slug, router]);

  return <p>Redirecting...</p>;
}
