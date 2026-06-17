import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopAppBar from "../components/layout/TopAppBar";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <TopAppBar title={t("home.title")} showBack={false} />

      {/* Main Content Canvas */}
      <main className="pt-20 px-margin-mobile min-h-screen space-y-6 max-w-md mx-auto">
        {/* Action Cards Grid */}
        <div className="space-y-4">
          {/* Card 1: Add Meal */}
          <button
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate("/add-meal")}
          >
            <div className="w-14 h-14 bg-primary-container/10 rounded-full flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-primary-container group-hover:text-white text-[32px]">
                restaurant
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                {t("home.addMeal")}
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                {t("home.addMealDesc")}
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>

          {/* Card 2: Participants */}
          <button
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate("/participants")}
          >
            <div className="w-14 h-14 bg-tertiary-fixed rounded-full flex items-center justify-center group-hover:bg-tertiary transition-colors duration-300">
              <span className="material-symbols-outlined text-tertiary group-hover:text-white text-[32px]">
                groups
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                {t("home.manageParticipants")}
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                {t("home.manageParticipantsDesc")}
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>

          {/* Card 3: Restaurants */}
          <button
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate("/restaurants")}
          >
            <div className="w-14 h-14 bg-secondary-fixed rounded-full flex items-center justify-center group-hover:bg-secondary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-secondary group-hover:text-on-secondary-container text-[32px]">
                store
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                {t("home.manageRestaurants")}
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                {t("home.manageRestaurantsDesc")}
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>

          {/* Card 4: Debts */}
          <button
            className="w-full text-left bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant squishy-active group transition-all duration-300 hover:border-primary-container flex items-center gap-4"
            onClick={() => navigate("/debts")}
          >
            <div className="w-14 h-14 bg-error-container rounded-full flex items-center justify-center group-hover:bg-error transition-colors duration-300">
              <span className="material-symbols-outlined text-error group-hover:text-on-error text-[32px]">
                credit_card
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline-md text-on-surface text-[20px]">
                {t("home.manageDebts")}
              </h3>
              <p className="text-on-surface-variant font-label-sm">
                {t("home.manageDebtsDesc")}
              </p>
            </div>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
