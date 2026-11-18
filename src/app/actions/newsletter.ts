"use server";

import { getDb } from "@/lib/mongodb";

export interface NewsletterSubscriptionInput {
  email: string;
  consent: boolean;
}

export async function subscribeCyberOregonNewsletter(
  input: NewsletterSubscriptionInput
) {
  const email = String(input?.email ?? "").trim().toLowerCase();

  if (
    input?.consent !== true ||
    email.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new Error("Informe um e-mail válido e confirme seu consentimento.");
  }

  const db = await getDb();
  const now = new Date();

  await db.collection("cyber_oregon_newsletter").updateOne(
    { email },
    {
      $set: {
        email,
        consent: true,
        subscribed: true,
        consentedAt: now,
        updatedAt: now,
        source: "landing_cyber_oregon",
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  return { subscribed: true };
}
