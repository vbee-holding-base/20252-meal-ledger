import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopAppBar from "../../components/layout/TopAppBar";
import { MOCK_RESTAURANTS } from "../../constants/restaurants";

const EditRestaurant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === id);

  const [name, setName] = useState(restaurant?.name ?? "");
  const [address, setAddress] = useState(restaurant?.address ?? "");
  const [errors, setErrors] = useState<{
    name?: string | undefined;
    address?: string | undefined;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Tên quán không được để trống";
    if (!address.trim()) next.address = "Địa chỉ không được để trống";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // TODO: gọi API update
    navigate(-1);
  };

  if (!restaurant) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant font-body-md">
          Không tìm thấy quán ăn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24">
      <TopAppBar title="Chỉnh sửa quán ăn" />

      <main className="mt-16 px-margin-mobile max-w-md mx-auto space-y-6 pt-6">
        {/* Icon preview */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-2xl ${restaurant.bg} flex items-center justify-center ${restaurant.text}`}
          >
            <span
              className="material-symbols-outlined text-[40px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {restaurant.icon}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_4px_20px_rgba(153,71,0,0.08)] space-y-5">
          <div className="space-y-1.5">
            <label className="text-label-md font-label-md text-on-surface-variant">
              Tên quán
            </label>
            <div
              className={`flex items-center gap-3 border-2 ${
                errors.name
                  ? "border-error"
                  : "border-surface-container-high focus-within:border-primary"
              } rounded-2xl px-4 transition-all`}
            >
              <span className="material-symbols-outlined text-on-surface-variant/60">
                storefront
              </span>
              <input
                className="flex-1 h-14 border-none focus:ring-0 p-0 text-body-md bg-transparent"
                placeholder="Nhập tên quán..."
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => {
                      const { name: _, ...rest } = prev;
                      void _;
                      return rest;
                    });
                }}
              />
            </div>
            {errors.name && (
              <p className="text-error text-label-sm font-label-sm pl-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-label-md font-label-md text-on-surface-variant">
              Địa chỉ
            </label>
            <div
              className={`flex items-start gap-3 border-2 ${
                errors.address
                  ? "border-error"
                  : "border-surface-container-high focus-within:border-primary"
              } rounded-2xl px-4 pt-3 pb-3 transition-all`}
            >
              <span className="material-symbols-outlined text-on-surface-variant/60 mt-0.5">
                location_on
              </span>
              <textarea
                className="flex-1 border-none focus:ring-0 p-0 text-body-md bg-transparent resize-none min-h-[60px]"
                placeholder="Nhập địa chỉ..."
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address)
                    setErrors((prev) => {
                      const { address: _, ...rest } = prev;
                      void _;
                      return rest;
                    });
                }}
              />
            </div>
            {errors.address && (
              <p className="text-error text-label-sm font-label-sm pl-1">
                {errors.address}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <button
            className="flex-1 h-14 rounded-full border-2 border-primary text-primary font-bold active:scale-95 transition-transform"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
          <button
            className="flex-1 h-14 rounded-full bg-primary-container text-on-primary font-bold shadow-md active:scale-95 transition-transform"
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditRestaurant;
