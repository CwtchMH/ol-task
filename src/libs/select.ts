import Select from "ol/interaction/Select";
import {
  selectedStyle,
  pointerMoveStyle,
  selectDoubleClickStyle,
} from "./style";
import { pointerMove, click } from "ol/events/condition";
import { doubleClick } from "ol/events/condition";

export const selectSingleclick = new Select({
  style: selectedStyle,
});

export const selectClick = new Select({
  condition: click,
  style: selectedStyle,
});

export const selectPointerMove = new Select({
  condition: pointerMove,
  style: pointerMoveStyle,
});

export const selectDoubleClick = new Select({
  condition: doubleClick,
  style: selectDoubleClickStyle,
});
