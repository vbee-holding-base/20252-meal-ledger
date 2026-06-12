import React, { useEffect, useState } from "react";
import { axiosPublic } from "../../api/axiosClient";

export interface LoginSearchResult {
  _id: string;
  ownerId: string;
  name: string;
  totalDebt: number;
  status: string;
}

export interface LoginSearchBarProps {
  placeholder?: string;
  onItemSelect?: (_item: LoginSearchResult) => void;
}

const LoginSearchBar: React.FC<LoginSearchBarProps> = ({ onItemSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<LoginSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setError(null);

      try {
        const response = await axiosPublic.get<{
          data: LoginSearchResult[];
          total: number;
        }>(`/debts/public?q=${encodeURIComponent(searchTerm)}`);
        setResults(response.data.data);
      } catch (err) {
        console.log(err);
        setError("Không thể lấy dữ liệu, Vui lòng thử lại.");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  return (
    <div className="relative group">
      <label className="absolute -top-2.5 left-4 px-base bg-surface-container-lowest text-label-sm text-primary font-semibold transition-all group-focus-within:text-primary-container">
        Tên của bạn
      </label>
      <input
        id="name-search-input"
        className="w-full h-14 bg-transparent border-2 border-outline-variant rounded-xl px-md font-body-md text-on-surface placeholder:text-outline/50 focus:border-primary-container focus:ring-0 transition-all outline-none"
        placeholder="VD: Nguyễn Văn A"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span className="material-symbols-outlined absolute right-4 top-4 text-outline group-focus-within:text-primary-container transition-colors">
        person_search
      </span>
      {isSearching && (
        <div className="mt-1 text-sm text-gray-500">Đang tìm kiếm...</div>
      )}
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
          {results.map((item) => (
            <li
              key={item._id}
              onClick={() => {
                setSearchTerm(item.name);
                setResults([]);
                if (onItemSelect) onItemSelect(item);
              }}
              className="px-4 py-2 cursor-pointer border-b border-gray-100 last:border-none hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-600">
                  {item.totalDebt.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoginSearchBar;
