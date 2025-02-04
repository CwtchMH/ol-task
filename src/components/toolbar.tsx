import {
  DrawAction,
  ModifyAction,
  TranslateAction,
  NotKnown,
} from "./controls";

export function ToolBar() {
  return (
    <div
      id="tool-bar"
      className="w-[80px] h-[100vh] bg-white border border-gray-200 flex flex-col items-center justify-evenly"
    >
      <DrawAction />
      <ModifyAction />
      <TranslateAction />
      <NotKnown />
    </div>
  );
}
