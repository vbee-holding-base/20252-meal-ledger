import React, { useState, useEffect } from "react";
import TopAppBar from "../../components/layout/TopAppBar";
import SearchBar from "../../components/common/SearchBar";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import type { Participant } from "../../types";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

const ParticipantManagement: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState("");
  const isBusy = isLoading || isAdding;

  type ParticipantApiResponse = {
    _id: string;
    ownerId: string;
    name: string;
    totalDebt: number;
    status: string;
  };

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.get("/participants");
      const participantsData = (response.data?.data ??
        []) as ParticipantApiResponse[];

      const mappedParticipants: Participant[] = participantsData.map(
        (item) => ({
          id: item._id,
          name: item.name,
          debt: item.totalDebt ?? 0,
          icon: "person",
          bg: "bg-primary-container",
          text: "text-on-primary",
          initial: item.name ? item.name.charAt(0).toUpperCase() : "?",
        }),
      );

      setParticipants(mappedParticipants);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách người tham gia.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchParticipants();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) {
      setError("Vui lòng nhập tên người tham gia.");
      return;
    }

    try {
      setIsAdding(true);
      setError(null);
      await axiosClient.post("/participants", { name: newName.trim() });
      setNewName("");
      await fetchParticipants();
    } catch (err) {
      console.error(err);
      setError("Không thể thêm người tham gia. Vui lòng thử lại.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteParticipant = async () => {
    if (!deleteTarget) return;

    try {
      setIsLoading(true);
      setError(null);
      await axiosClient.delete(`/participants/${deleteTarget.id}`);
      setDeleteTarget(null);
      await fetchParticipants();
    } catch (err) {
      console.error(err);
      setError("Không thể xóa người tham gia. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title="Người tham gia" />

      <main className="flex-1 mt-16 pb-32">
        <section className="px-margin-mobile sticky bg-surface z-40 pt-4 pb-2 top-12">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm tên người tham gia..."
          />
        </section>

        {isLoading && (
          <div className="px-margin-mobile py-3">
            <p className="text-on-surface-variant text-center">Đang tải...</p>
          </div>
        )}

        <section className="px-margin-mobile pb-4 pt-2">
          <div className="flex gap-2 items-center">
            <input
              className="flex-1 h-12 px-4 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline"
              placeholder="Tên người dùng"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button
              className="w-12 h-12 bg-primary-container text-on-primary rounded-xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
              onClick={handleAdd}
              disabled={isBusy}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          {error && <p className="mt-3 text-error font-body-sm">{error}</p>}
        </section>

        <section className="px-margin-mobile flex flex-col gap-3">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-label-md font-label-md text-on-surface-variant">
              Tất cả người tham gia ({filtered.length})
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
                    <p className="font-body-md text-body-md text-on-surface">
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
                    onClick={() => navigate(`/participants/${p.id}/edit`)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    className="p-2 text-on-surface-variant hover:text-error transition-colors"
                    onClick={() => setDeleteTarget(p)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteParticipant}
        name={deleteTarget?.name ?? ""}
        warningMessage={
          deleteTarget && deleteTarget.debt > 0
            ? `Người này vẫn còn nợ ${deleteTarget.debt / 1000}k. Xóa sẽ làm mất dữ liệu khoản nợ này.`
            : undefined
        }
      />
    </div>
  );
};

export default ParticipantManagement;
