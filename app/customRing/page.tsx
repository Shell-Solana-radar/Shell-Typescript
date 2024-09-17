"use client"
import { useState } from "react";
import { useDrag, useDrop , DndProvider} from "react-dnd";
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./Design2.module.css";

interface Ring {
  id: number;
  src: string;
  position: {
    top: number;
    left: number;
  };
  size: {
    width: number;
    height: number;
  };
}

interface RingItemProps {
  ring: Ring;
  index: number;
}

interface HandDropAreaProps {
  handImage: string | null;
  rings: Ring[];
  onDropRing: (index: number, offset: { x: number; y: number }) => void;
  onResizeRing: (index: number, size: { width: string; height: string; x: number; y: number }) => void;
}

const RingItem: React.FC<RingItemProps> = ({ ring, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ring",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <img
      ref={drag}
      src={ring.src}
      alt={`Ring ${index}`}
      className={styles.ringItem}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    />
  );
};

const HandDropArea: React.FC<HandDropAreaProps> = ({ handImage, rings, onDropRing, onResizeRing }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ring",
    drop: (item: { index: number }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        onDropRing(item.index, { x: offset.x, y: offset.y });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className={styles.handDropArea} ref={drop}>
      {handImage && <img src={handImage} alt="Hand" className={styles.handImage} />}
      {rings.map((ring, index) => (
        <Rnd
          key={ring.id}
          default={{
            x: ring.position.left,
            y: ring.position.top,
            width: ring.size.width,
            height: ring.size.height,
          }}
          bounds="parent"
          onDragStop={(_e, d) => onDropRing(index, { x: d.x, y: d.y })}
          onResizeStop={(_e, _direction, ref, _delta, position) => {
            onResizeRing(index, {
              width: ref.style.width,
              height: ref.style.height,
              ...position,
            });
          }}
        >
          <img
            src={ring.src}
            alt={`Ring ${index}`}
            className={styles.placedRing}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Rnd>
      ))}
    </div>
  );
};

const CustomHandRing: React.FC = () => {
  const [handImage, setHandImage] = useState<string | null>(null);
  const [rings, setRings] = useState<Ring[]>([
    {
      id: 1,
      src: "../../public/rings/ring1.png",
      position: { top: 0, left: 0 },
      size: { width: 50, height: 50 },
    },
    {
      id: 2,
      src: "../../public/rings/ring2.png",
      position: { top: 0, left: 0 },
      size: { width: 50, height: 50 },
    },
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHandImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRingDrop = (ringIndex: number, offset: { x: number; y: number }) => {
    const updatedRings = rings.map((ring, index) =>
      index === ringIndex
        ? { ...ring, position: { top: offset.y, left: offset.x } }
        : ring
    );
    setRings(updatedRings);
  };

  const handleRingResize = (ringIndex: number, size: { width: string; height: string; x: number; y: number }) => {
    const updatedRings = rings.map((ring, index) =>
      index === ringIndex
        ? {
            ...ring,
            size: { width: parseInt(size.width), height: parseInt(size.height) },
            position: { top: size.y, left: size.x },
          }
        : ring
    );
    setRings(updatedRings);
  };

  const handleSave = () => {
    // Save the design to localStorage or backend
    alert("Design saved!");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.customRingApp}>
        <h2>Custom Hand Ring Designer</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {handImage && (
          <div className={styles.ringDesigner}>
            <HandDropArea
              handImage={handImage}
              rings={rings}
              onDropRing={handleRingDrop}
              onResizeRing={handleRingResize}
            />
          </div>
        )}

        {/* Ring Carousel */}
        <div className={styles.ringCarousel}>
          {rings.map((ring, index) => (
            <RingItem key={ring.id} ring={ring} index={index} />
          ))}
        </div>

        {handImage && (
          <button onClick={handleSave} className={styles.saveButton}>
            Save Design
          </button>
        )}
      </div>
    </DndProvider>
  );
};

export default CustomHandRing;
