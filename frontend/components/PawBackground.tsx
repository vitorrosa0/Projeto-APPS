import { MdPets } from "react-icons/md";

const PAW_POSITIONS = [
  { top: "10%", left: "78%", size: 18 },
  { top: "25%", left: "5%",  size: 14 },
  { top: "45%", left: "85%", size: 16 },
  { top: "65%", left: "3%",  size: 20 },
  { top: "80%", left: "70%", size: 14 },
];

export default function PawBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {PAW_POSITIONS.map((pos, i) => (
        <MdPets
          key={i}
          size={pos.size}
          style={{ position: "absolute", top: pos.top, left: pos.left, opacity: 0.07, color: "#2DB38B" }}
        />
      ))}
    </div>
  );
}