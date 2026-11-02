import { useRoomStore } from "../store/useRoomStore.js";
import { HighlightContext } from "./HighlightContext.js";

export default function Interactive({ id, children }) {
  const lit = useRoomStore((state) => state.hovered === id);
  const setHovered = useRoomStore((state) => state.setHovered);
  const open = useRoomStore((state) => state.open);

  const handleOver = (event) => {
    event.stopPropagation();
    if (useRoomStore.getState().focus === null) setHovered(id);
  };
  const handleOut = (event) => {
    event.stopPropagation();
    if (useRoomStore.getState().hovered === id) setHovered(null);
  };
  const handleClick = (event) => {
    event.stopPropagation();
    open(id);
  };

  return (
    <HighlightContext.Provider value={lit}>
      <group onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        {children}
      </group>
    </HighlightContext.Provider>
  );
}
