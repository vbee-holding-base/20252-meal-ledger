import React from "react";
import TopAppBar from "../../components/layout/TopAppBar";
import SearchBar from "../../components/common/SearchBar";
import { useState, useEffect } from "react";
import type { Participant } from "../../types";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

const DebtManagement: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  type ParticipantApiResponse = {
    _id: string;
    ownerId: string;
    name: string;
    totalDebt: number;
    status: string;
  };

  const fetchDebt = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.get("/debts");
      const DebtsData = (response.data?.data ?? []) as ParticipantApiResponse[];

      const mappedParticipants: Participant[] = DebtsData.map((item) => ({
        id: item._id,
        name: item.name,
        debt: item.totalDebt ?? 0,
        icon: "person",
        bg: "bg-primary-container",
        text: "text-on-primary",
        initial: item.name ? item.name.charAt(0).toUpperCase() : "?",
      }));

      setParticipants(mappedParticipants);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách nợ.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDebt();
  }, []);

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title="Quản lý nợ" />

      <main className="flex-1 mt-16 pb-32">
        <section className="px-margin-mobile sticky bg-surface z-40 pt-1 pb-2 top-12">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm nợ theo tên người tham gia"
          />
        </section>

        {isLoading && (
          <div className="px-margin-mobile py-3">
            <p className="text-on-surface-variant text-center">Đang tải...</p>
          </div>
        )}

        {error && (
          <div className="px-margin-mobile py-3">
            <p className="text-error text-center">{error}</p>
          </div>
        )}

        <section className="px-margin-mobile flex flex-col gap-3">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-label-md font-label-md text-on-surface-variant">
              Tất cả nợ ({filtered.length})
            </h2>
            <button className="text-primary font-label-sm text-label-sm flex items-center gap-1">
              Sắp xếp
              <span className="material-symbols-outlined text-base leading-none ml-1">
                unfold_more
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(153,71,0,0.06)] active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${p.bg} flex items-center justify-center ${p.text} font-bold text-headline-md`}
                  >
                    {p.initial ?? p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body-md text-body-md font-bold text-on-surface">
                      {p.name}
                    </p>
                    {p.debt && p.debt > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-error text-label-sm">
                        {p.debt.toLocaleString("vi-VN")}đ
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-tertiary text-label-sm">
                        0đ
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                    onClick={() => navigate(`/debts/${p.id}`)}
                  >
                    <span className="material-symbols-outlined">info</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
export default DebtManagement;
