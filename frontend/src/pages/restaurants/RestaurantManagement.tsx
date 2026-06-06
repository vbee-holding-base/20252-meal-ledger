import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopAppBar from "../../components/layout/TopAppBar";
import SearchBar from "../../components/common/SearchBar";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import type { Restaurant } from "../../types";
import axiosClient from "../../api/axiosClient";

const RestaurantManagement: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type RestaurantApiResponse = {
    _id: string;
    name: string;
    address?: string;
  };

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.get("/restaurants");
      const restaurantsData = (response.data?.data ??
        []) as RestaurantApiResponse[];

      const mappedRestaurants: Restaurant[] = restaurantsData.map((item) => ({
        id: item._id,
        name: item.name,
        address: item.address ?? "",
        icon: "restaurant",
        bg: "bg-primary-container",
        text: "text-on-primary",
      }));

      setRestaurants(mappedRestaurants);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách quán ăn.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestaurant = async () => {
    if (!newName.trim()) {
      setError("Vui lòng nhập tên quán ăn.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await axiosClient.post("/restaurants", {
        name: newName,
        address: newAddress,
      });

      setNewName("");
      setNewAddress("");
      await fetchRestaurants();
    } catch (err) {
      console.error(err);
      setError("Không thể thêm quán ăn. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteRestaurant = async () => {
    if (!deleteTarget) return;

    try {
      setIsLoading(true);
      setError(null);

      await axiosClient.delete(`/restaurants/${deleteTarget.id}`);
      setDeleteTarget(null);
      await fetchRestaurants();
    } catch (err) {
      console.error(err);
      setError("Không thể xóa quán ăn. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <TopAppBar title="Quán ăn" />

      <main className="pt-20 pb-base px-margin-mobile max-w-md mx-auto">
        <section className="sticky bg-surface z-40 pt-1 pb-2 top-12">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm tên quán ăn..."
          />
        </section>

        <section className="pb-4">
          <div className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <input
                className="w-full h-12 px-4 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline"
                placeholder="Tên quán"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                className="w-full h-12 px-4 rounded-xl border-none bg-surface-container-low text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all placeholder:text-outline"
                placeholder="Địa chỉ"
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <button
              className="w-12 h-[104px] bg-primary-container text-on-primary rounded-xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
              onClick={handleAddRestaurant}
              disabled={isLoading || !newName.trim()}
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          </div>
          {error && <p className="mt-3 text-error font-body-sm">{error}</p>}
        </section>

        <section className="flex justify-between items-end mb-4">
          <h2 className="font-label-md text-label-md text-on-surface-variant">
            Tất cả quán ăn ({filtered.length})
          </h2>
          <button className="text-primary font-label-sm text-label-sm flex items-center gap-1">
            Sắp xếp
            <span className="material-symbols-outlined text-sm">
              unfold_more
            </span>
          </button>
        </section>

        <div className="space-y-4">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="bg-surface-container-lowest p-md rounded-xl card-shadow flex items-center gap-4 transition-all hover:scale-[1.01]"
            >
              <div
                className={`w-14 h-14 ${r.bg} rounded-xl flex items-center justify-center ${r.text}`}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {r.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline-md text-[18px] leading-tight text-on-surface truncate">
                  {r.name}
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-start gap-1">
                  <span className="material-symbols-outlined text-xs mt-0.5">
                    location_on
                  </span>
                  {r.address}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => navigate(`/restaurants/${r.id}/edit`)}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  className="p-2 text-on-surface-variant hover:text-error transition-colors"
                  onClick={() => setDeleteTarget(r)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-xl text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">
              search_off
            </span>
            <p className="font-headline-md text-headline-md">
              Không tìm thấy quán
            </p>
            <p className="font-body-md text-body-md">
              Hãy thử tìm với tên khác nhé!
            </p>
          </div>
        )}
      </main>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteRestaurant}
        name={deleteTarget?.name ?? ""}
      />
    </div>
  );
};

export default RestaurantManagement;
