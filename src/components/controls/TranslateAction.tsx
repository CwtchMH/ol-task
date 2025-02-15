import { useEffect } from "react";
import { useTypeContext } from "../../context/TypeProvider";

export const TranslateAction = () => {
  const {
    setEnableTranslate,
    enableTranslate,
    setEnableModify,
    setEnableSelect,
    setEnableDraw,
    setTypeInteraction,
    enableSelect,
    typeInteraction,
    setTempFeature,
    tempFeature,
    setIsSelected,
  } = useTypeContext();

  const handleClick = () => {
    setEnableTranslate(false);
    setEnableModify(false);
    setEnableSelect(true);
    setEnableDraw(false);
    setTypeInteraction("Translate");
    setTempFeature(null);
    setIsSelected(false);
  };

  useEffect(() => {
    if (enableTranslate) {
      console.log("Translate action enabled");
    }
    if (enableSelect) {
      console.log("Select action enabled");
    }
  }, [enableTranslate, enableSelect, typeInteraction, tempFeature]);

  return (
    <div
      className={`hover:bg-blue-400 ${enableTranslate || (enableSelect && typeInteraction === "Translate") ? "bg-blue-400" : ""} hover:cursor-pointer p-2 rounded-md`}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
        />
      </svg>
    </div>
  );
};

export default TranslateAction;
