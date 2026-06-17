import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../../components/layout/TopAppBar";
import axiosClient from "../../api/axiosClient";
import type { Participant } from "../../types";

const EditParticipant: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  type ParticipantApiResponse = {
    _id: string;
    ownerId: string;
    name: string;
    totalDebt: number;
    status: string;
  };

  const fetchParticipant = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await axiosClient.get("/participants");
      const participantsData = (response.data?.data ??
        []) as ParticipantApiResponse[];
      const found = participantsData.find((item) => item._id === id);

      if (!found) {
        setError(t("editParticipant.notFound"));
        setParticipant(null);
        return;
      }

      const mapped: Participant = {
        id: found._id,
        name: found.name,
        debt: found.totalDebt ?? 0,
        bg: "bg-primary-container",
        text: "text-on-primary",
        initial: found.name ? found.name.charAt(0).toUpperCase() : "?",
      };

      setParticipant(mapped);
      setName(mapped.name);
    } catch (err) {
      console.error(err);
      setError(t("editParticipant.fetchError"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchParticipant();
  }, [id]);

  const handleSave = async () => {
    if (!name.trim() || !id) {
      setError(t("editParticipant.emptyNameError"));
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      await axiosClient.put(`/participants/${id}`, { name: name.trim() });
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError(t("editParticipant.updateError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant font-body-md">
          {t("editParticipant.loading")}
        </p>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant font-body-md">
          {error || t("editParticipant.notFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title={t("editParticipant.title")} />

      <main className="mt-16 px-margin-mobile max-w-md mx-auto space-y-6 pt-6">
        {/* Avatar preview */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-full ${participant.bg} flex items-center justify-center ${participant.text} font-bold text-[32px]`}
          >
            {name.trim().charAt(0).toUpperCase() || participant.initial}
          </div>
        </div>

        {/* Form */}
        <div className="bg-surface-container-lowest rounded-2xl p-md card-shadow space-y-5">
          <div className="space-y-1.5">
            <label className="text-label-md font-label-md text-on-surface-variant">
              {t("editParticipant.nameLabel")}
            </label>
            <input
              className={`w-full h-14 px-4 rounded-2xl border ${
                error
                  ? "border-error"
                  : "border-outline-variant focus:border-primary"
              } focus:ring-0 text-body-md text-on-surface transition-all bg-transparent`}
              placeholder={t("editParticipant.namePlaceholder")}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
            />
            {error && (
              <p className="text-error text-label-sm font-label-sm pl-1">
                {error}
              </p>
            )}
          </div>

          {/* Debt info (read-only) */}
          <div className="space-y-1.5">
            <label className="text-label-md font-label-md text-on-surface-variant">
              {t("editParticipant.debtLabel")}
            </label>
            <div className="w-full h-14 px-4 rounded-2xl border border-outline-variant bg-surface-container-low flex items-center">
              <span
                className={`font-bold text-body-md ${
                  participant.debt > 0 ? "text-error" : "text-tertiary"
                }`}
              >
                {participant.debt > 0
                  ? `${participant.debt.toLocaleString("vi-VN")}đ`
                  : t("editParticipant.noDebt")}
              </span>
            </div>
            <p className="text-label-sm text-on-surface-variant pl-1">
              {t("editParticipant.debtAutoCalc")}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <button
            className="flex-1 h-14 rounded-full border border-primary text-primary font-bold active:scale-95 transition-transform"
            onClick={() => navigate("/participants")}
          >
            {t("editParticipant.cancel")}
          </button>
          <button
            className="flex-1 h-14 rounded-full bg-primary-container text-on-primary font-bold shadow-md active:scale-95 transition-transform disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? t("editParticipant.saving") : t("editParticipant.save")}
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditParticipant;
