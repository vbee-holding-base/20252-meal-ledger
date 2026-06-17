import React, { useState } from "react";
import { formatCurrency } from "../utils/format";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/layout/TopAppBar";
import SubmitButton from "../components/common/SubmitButton";
import ParticipantMealCard from "../components/common/ParticipantMealCard";
import axiosClient from "../api/axiosClient";

interface EntryState {
  localId: number;
  personName: string;
  participantId: string | null;
  amount: string;
}

interface LocationState {
  parsedData?: {
    restaurantName?: string;
    restaurantId?: string | null;
    date?: string;
    totalAmount?: number;
    entries?: {
      personName: string;
      participantId: string | null;
      amount: number | null;
    }[];
  };
}

const AddMealDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const parsedData = (location.state as LocationState)?.parsedData;

  const [restaurantName, setRestaurantName] = useState<string>(
    parsedData?.restaurantName ?? "",
  );
  const [restaurantId, setRestaurantId] = useState<string | null>(
    parsedData?.restaurantId ?? null,
  );
  const [mealDate, setMealDate] = useState<string>(
    parsedData?.date
      ? new Date(parsedData.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [totalAmount, setTotalAmount] = useState<string>(
    parsedData?.totalAmount != null ? String(parsedData.totalAmount) : "",
  );
  const [entries, setEntries] = useState<EntryState[]>(
    parsedData?.entries?.map((e, i) => ({
      localId: Date.now() + i,
      personName: e.personName,
      participantId: e.participantId,
      amount: e.amount != null ? String(e.amount) : "",
    })) ?? [],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<Record<number, boolean>>({});
  const [createError, setCreateError] = useState<string | null>(null);
  const [totalFocused, setTotalFocused] = useState(false);

  if (!parsedData) {
    return <Navigate to="/add-meal" replace />;
  }

  const hasAllIds =
    restaurantId != null &&
    entries.length > 0 &&
    entries.every((e) => e.participantId != null);

  const allEntriesCreated =
    entries.length > 0 && entries.every((e) => e.participantId != null);

  const nameEmpty = (name: string) => name.trim() === "";
  const amountEmpty = (amount: string) =>
    amount.trim() === "" || Number(amount) <= 0;
  const restaurantNameEmpty = restaurantName.trim() === "";
  const totalAmountEmpty =
    totalAmount.trim() === "" || Number(totalAmount) <= 0;

  const allFilled =
    !restaurantNameEmpty &&
    !totalAmountEmpty &&
    entries.length > 0 &&
    entries.every((e) => !nameEmpty(e.personName) && !amountEmpty(e.amount));

  const displayTotal = totalFocused ? totalAmount : formatCurrency(totalAmount);

  const computedTotal = entries.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0,
  );
  const totalAmountNum = Number(totalAmount) || 0;
  const totalMismatch =
    computedTotal > 0 && totalAmountNum > 0 && computedTotal !== totalAmountNum;

  const canSave = hasAllIds && allFilled && !isSaving;

  const handleNameChange = (localId: number, value: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.localId === localId ? { ...e, personName: value } : e,
      ),
    );
  };

  const handlePriceChange = (localId: number, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.localId === localId ? { ...e, amount: value } : e)),
    );
  };

  const handleDeleteEntry = (localId: number) => {
    setEntries((prev) => prev.filter((e) => e.localId !== localId));
  };

  const handleAddEntry = async () => {
    const name = window.prompt(
      t("addMealDetail.memberName", { n: entries.length + 1 }),
    );
    if (!name?.trim()) return;

    try {
      const res = await axiosClient.post("/participants", {
        name: name.trim(),
      });
      const newParticipant = res.data;
      setEntries((prev) => [
        ...prev,
        {
          localId: Date.now(),
          personName: newParticipant.name,
          participantId: newParticipant.id ?? newParticipant._id,
          amount: "",
        },
      ]);
    } catch {
      setEntries((prev) => [
        ...prev,
        {
          localId: Date.now(),
          personName: name.trim(),
          participantId: null,
          amount: "",
        },
      ]);
    }
  };

  const handleQuickCreateParticipant = async (localId: number) => {
    setIsCreating((prev) => ({ ...prev, [localId]: true }));
    setCreateError(null);
    try {
      const entry = entries.find((e) => e.localId === localId);
      if (!entry) return;
      const res = await axiosClient.post("/participants", {
        name: entry.personName,
      });
      const newParticipant = res.data;
      setEntries((prev) =>
        prev.map((e) =>
          e.localId === localId
            ? { ...e, participantId: newParticipant.id ?? newParticipant._id }
            : e,
        ),
      );
    } catch {
      setCreateError(t("addMealDetail.quickCreateError"));
    } finally {
      setIsCreating((prev) => ({ ...prev, [localId]: false }));
    }
  };

  const handleQuickCreateRestaurant = async () => {
    if (!restaurantName.trim()) return;
    setCreateError(null);
    try {
      const res = await axiosClient.post("/restaurants", {
        name: restaurantName.trim(),
      });
      const newRestaurant = res.data;
      setRestaurantId(newRestaurant.id ?? newRestaurant._id);
    } catch {
      setCreateError(t("addMealDetail.quickCreateError"));
    }
  };

  const handleSubmit = async () => {
    if (!canSave) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await axiosClient.post("/meals", {
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        meal_time: new Date(mealDate).toISOString(),
        total_amount: Number(totalAmount) || computedTotal,
        participants: entries.map((e) => ({
          participant_id: e.participantId,
          amount: Number(e.amount) || 0,
        })),
      });
      navigate("/");
    } catch {
      setSaveError(t("addMealDetail.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-background px-4 pb-24 relative flex flex-col">
        <div className="flex justify-center">
          <TopAppBar title={t("addMealDetail.title")} />
        </div>

        <main className="flex-1 pt-20 pb-4 overflow-y-auto space-y-4">
          <section className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30">
            <label className="text-sm font-medium text-on-surface-variant/80 pl-1">
              {t("addMealDetail.restaurantName")}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className={`flex-1 bg-surface-container-low border focus:border-primary-container focus:ring-0 rounded-2xl h-14 px-4 text-body-md text-on-surface transition-all duration-200 outline-none ${
                  restaurantName.trim() === ""
                    ? "border-error"
                    : "border-outline-variant"
                }`}
                placeholder={t("addMealDetail.restaurantName")}
              />
              {restaurantId == null && restaurantName.trim() && (
                <button
                  type="button"
                  onClick={handleQuickCreateRestaurant}
                  className="shrink-0 text-primary hover:bg-primary-container/10 p-2 rounded-full transition-colors active:scale-95 duration-150"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    add
                  </span>
                </button>
              )}
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-on-surface-variant/80 pl-1">
                  {t("addMealDetail.date")}
                </label>
                <input
                  type="date"
                  value={mealDate}
                  onChange={(e) => setMealDate(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant focus:border-primary-container focus:ring-0 rounded-2xl h-14 px-4 text-body-md text-on-surface transition-all duration-200 outline-none mt-1"
                />
              </div>
              <div className="w-40">
                <label className="text-sm font-medium text-on-surface-variant/80 pr-1">
                  {t("addMealDetail.totalAmount")}
                </label>
                <div className="relative flex items-center mt-1">
                  <input
                    type="text"
                    value={displayTotal}
                    onChange={(e) =>
                      setTotalAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    onFocus={(e) => {
                      setTotalFocused(true);
                      e.target.select();
                    }}
                    onBlur={() => setTotalFocused(false)}
                    className={`w-full bg-surface-container-low border focus:border-primary-container focus:ring-0 rounded-2xl h-14 pl-4 pr-7 text-body-md text-on-surface transition-all duration-200 outline-none font-medium ${
                      totalAmount.trim() === ""
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    placeholder="0"
                  />
                  <span className="absolute right-2 text-on-surface-variant/60 font-normal text-lg pointer-events-none">
                    {t("participantMealCard.currency")}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {entries.map((entry) => (
            <ParticipantMealCard
              key={entry.localId}
              participantName={entry.personName}
              onNameChange={(value) => handleNameChange(entry.localId, value)}
              price={entry.amount}
              onPriceChange={(value) => handlePriceChange(entry.localId, value)}
              onDelete={() => handleDeleteEntry(entry.localId)}
              isNewParticipant={entry.participantId == null}
              onQuickCreate={
                entry.participantId == null
                  ? () => handleQuickCreateParticipant(entry.localId)
                  : undefined
              }
              nameError={nameEmpty(entry.personName)}
              amountError={amountEmpty(entry.amount)}
              creating={isCreating[entry.localId]}
            />
          ))}

          <button
            type="button"
            onClick={handleAddEntry}
            className="w-full h-14 border-2 border-dashed border-outline/40 hover:border-primary/60 hover:bg-primary/5 rounded-3xl text-on-surface-variant font-semibold text-base transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            {t("addMealDetail.addMember")}
          </button>

          {entries.length > 0 && !allEntriesCreated && (
            <p className="text-xs text-warning text-center">
              {t("addMealDetail.quickCreateHint")}
            </p>
          )}

          {totalMismatch && (
            <p className="text-xs text-warning text-center">
              {t("addMealDetail.totalMismatch", {
                computed: computedTotal.toLocaleString("vi-VN"),
                entered: totalAmountNum.toLocaleString("vi-VN"),
              })}
            </p>
          )}

          {createError && (
            <p className="text-xs text-error text-center">{createError}</p>
          )}
        </main>

        {saveError && (
          <p className="text-error text-sm text-center mb-2">{saveError}</p>
        )}

        <SubmitButton
          title={isSaving ? t("addMealDetail.saving") : t("addMealDetail.save")}
          onClick={handleSubmit}
          disabled={!canSave}
        />
      </div>
    </div>
  );
};

export default AddMealDetail;
