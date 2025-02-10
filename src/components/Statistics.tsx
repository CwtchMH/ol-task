import { useCombinedContext } from "../hooks/useCombinedContext";

export const handleSumInteractions = (
  modifyQuantity: number,
  drawQuantity: number,
  translateQuantity: number,
) => {
  return modifyQuantity + drawQuantity + translateQuantity;
};

export const handleMinInteraction = (
  featureQuantity: number,
  modifyQuantity: number,
  drawQuantity: number,
  translateQuantity: number,
) => {
  return Math.min(
    featureQuantity,
    modifyQuantity,
    drawQuantity,
    translateQuantity,
  );
};

export const handleMaxInteraction = (
  featureQuantity: number,
  modifyQuantity: number,
  drawQuantity: number,
  translateQuantity: number,
) => {
  return Math.max(
    featureQuantity,
    modifyQuantity,
    drawQuantity,
    translateQuantity,
  );
};

export const Statistics = () => {
  const { featureQuantity, modifyQuantity, drawQuantity, translateQuantity } =
    useCombinedContext();

  const sum = handleSumInteractions(
    featureQuantity,
    modifyQuantity,
    drawQuantity,
  );
  const min = handleMinInteraction(
    featureQuantity,
    modifyQuantity,
    drawQuantity,
    translateQuantity,
  );
  const max = handleMaxInteraction(
    featureQuantity,
    modifyQuantity,
    drawQuantity,
    translateQuantity,
  );

  return (
    <div className="flex flex-row justify-evenly border border-gray-200 border-l-0">
      <p>Sum Interactions: {sum}</p>
      <p>Min Interaction: {min}</p>
      <p>Max Interaction: {max}</p>
      <p>Feature Quantity: {featureQuantity}</p>
      <p>Modify Quantity: {modifyQuantity}</p>
      <p>Draw Quantity: {drawQuantity}</p>
      <p>Translate Quantity: {translateQuantity}</p>
    </div>
  );
};
