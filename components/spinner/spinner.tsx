import React from "react";

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-transparent border-t-[#BEFF1B]"
        style={{ borderTopColor: "#BEFF1B" }}
      />
    </div>
  );
};
