import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadingEffect } from "../../redux/features/userSlice";

const Loading = () => {
  const selector = useSelector;

  let loading = selector(loadingEffect);

  useEffect(() => {}, [loading]);
  return (
    <div className={`grayed-bg ${loading ? "active" : ""}`}>
      <div className="spinner-border text-primary spinner" role="status"></div>
    </div>
  );
};

export default Loading;
