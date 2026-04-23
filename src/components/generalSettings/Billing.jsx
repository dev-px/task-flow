"use client";

import { CreditCard, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import SectionCard from "../layout/SectionCard";
import Field from "../layout/Field";

export default function BillingSettingsTab() {
  const [billing, setBilling] = useState({
    currentPlan: "Business Pro",
    billingCycle: "Monthly",
    renewalDate: "2026-06-15",

    seatsUsed: 18,
    totalSeats: 25,

    storageUsed: "128 GB",
    storageLimit: "500 GB",

    billingEmail: "accounts@technova.com",
    autoRenewal: true,

    savedCards: [
      {
        id: 1,
        cardHolder: "TechNova Pvt Ltd",
        cardType: "Credit Card",
        provider: "Visa",
        last4: "4521",
        expiryMonth: "08",
        expiryYear: "2028",
        isDefault: true,
      },
    ],

    invoiceHistory: [
      {
        id: 1,
        invoiceNo: "INV-2026-001",
        amount: "₹12,500",
        status: "Paid",
        date: "2026-04-01",
      },
      {
        id: 2,
        invoiceNo: "INV-2026-002",
        amount: "₹12,500",
        status: "Pending",
        date: "2026-05-01",
      },
    ],
  });

  const [newCard, setNewCard] = useState({
    cardHolder: "",
    cardType: "Credit Card",
    provider: "Visa",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
  });

  const updateCardField = (key, value) => {
    setNewCard((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddCard = () => {
    if (
      !newCard.cardHolder ||
      !newCard.cardNumber ||
      !newCard.expiryMonth ||
      !newCard.expiryYear
    )
      return;

    const last4 = newCard.cardNumber.slice(-4);

    const newSavedCard = {
      id: Date.now(),
      cardHolder: newCard.cardHolder,
      cardType: newCard.cardType,
      provider: newCard.provider,
      last4,
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      isDefault: billing.savedCards.length === 0,
    };

    setBilling((prev) => ({
      ...prev,
      savedCards: [...prev.savedCards, newSavedCard],
    }));

    setNewCard({
      cardHolder: "",
      cardType: "Credit Card",
      provider: "Visa",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
    });
  };

  const handleDeleteCard = (id) => {
    setBilling((prev) => ({
      ...prev,
      savedCards: prev.savedCards.filter((card) => card.id !== id),
    }));
  };

  const handleSetDefaultCard = (id) => {
    setBilling((prev) => ({
      ...prev,
      savedCards: prev.savedCards.map((card) => ({
        ...card,
        isDefault: card.id === id,
      })),
    }));
  };
  return (
    <SectionCard title="Billing & Subscription" icon={CreditCard}>
      <div className="space-y-8">
        {/* SAVED PAYMENT METHODS */}
        <div className="rounded-2xl border p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg">Saved Payment Methods</h3>
            <p className="text-sm text-muted-foreground">
              Manage company cards used for subscription billing
            </p>
          </div>

          {/* CARD LIST */}
          <div className="space-y-4">
            {billing.savedCards.map((card) => (
              <div
                key={card.id}
                className="border rounded-xl p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {card.provider} •••• {card.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {card.cardType} • Expires {card.expiryMonth}/
                    {card.expiryYear}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Card Holder: {card.cardHolder}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {card.isDefault ? (
                    <Badge>Default</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefaultCard(card.id)}
                    >
                      Set Default
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD NEW CARD */}
          <div className="border rounded-2xl p-6 space-y-5">
            <h4 className="font-semibold">Add New Card</h4>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Card Holder Name">
                <Input
                  value={newCard.cardHolder}
                  onChange={(e) =>
                    updateCardField("cardHolder", e.target.value)
                  }
                  placeholder="Enter company / person name"
                />
              </Field>

              <Field label="Card Type">
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={newCard.cardType}
                  onChange={(e) => updateCardField("cardType", e.target.value)}
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                </select>
              </Field>

              <Field label="Card Provider">
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={newCard.provider}
                  onChange={(e) => updateCardField("provider", e.target.value)}
                >
                  <option>Visa</option>
                  <option>MasterCard</option>
                  <option>RuPay</option>
                  <option>American Express</option>
                </select>
              </Field>

              <Field label="Card Number">
                <Input
                  value={newCard.cardNumber}
                  onChange={(e) =>
                    updateCardField("cardNumber", e.target.value)
                  }
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </Field>

              <Field label="Expiry Month">
                <Input
                  value={newCard.expiryMonth}
                  onChange={(e) =>
                    updateCardField("expiryMonth", e.target.value)
                  }
                  placeholder="08"
                />
              </Field>

              <Field label="Expiry Year">
                <Input
                  value={newCard.expiryYear}
                  onChange={(e) =>
                    updateCardField("expiryYear", e.target.value)
                  }
                  placeholder="2028"
                />
              </Field>
            </div>

            <Button onClick={handleAddCard}>Save Card</Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
