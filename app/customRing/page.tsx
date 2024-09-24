"use client";
import { useState, useRef, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { Rnd } from "react-rnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import styles from "./Design2.module.css";
import Image, { StaticImageData } from "next/image";
import { RingImg1, RingImg2 } from "@/public/assets/images";
interface Ring {
  id: number;
  src: StaticImageData;
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
  onResizeRing: (
    index: number,
    size: { width: string; height: string; x: number; y: number }
  ) => void;
}

const HandDropArea: React.FC<HandDropAreaProps> = ({
  handImage,
  rings,
  onDropRing,
  onResizeRing,
}) => {
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

  // Create a ref to hold the div element
  const dropRef = useRef<HTMLDivElement>(null);

  // Use useEffect to apply the drop ref
  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef);
    }
  }, [drop]);

  return (
    <div className={styles.handDropArea} ref={dropRef}>
      {handImage && (
        <img src={handImage} alt="Hand" className={styles.handImage} />
      )}
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
          <Image
            src={ring.src}
            alt={`Ring ${index}`}
            className={styles.placedRing}
            style={{
              width: "100%",
              height: "100%",
            }}
            width={300}
            height={300}
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
      src: RingImg1,
      position: { top: 0, left: 0 },
      size: { width: 50, height: 50 },
    },
    {
      id: 2,
      src: RingImg2,
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

  const handleRingDrop = (
    ringIndex: number,
    offset: { x: number; y: number }
  ) => {
    const updatedRings = rings.map((ring, index) =>
      index === ringIndex
        ? { ...ring, position: { top: offset.y, left: offset.x } }
        : ring
    );
    setRings(updatedRings);
  };

  const handleRingResize = (
    ringIndex: number,
    size: { width: string; height: string; x: number; y: number }
  ) => {
    const updatedRings = rings.map((ring, index) =>
      index === ringIndex
        ? {
            ...ring,
            size: {
              width: parseInt(size.width),
              height: parseInt(size.height),
            },
            position: { top: size.y, left: size.x },
          }
        : ring
    );
    setRings(updatedRings);
  };

  const handleSave = async () => {
    // Convert image to JPG format if necessary
    const jpgImage = await convertToJpg(handImage);
    if (jpgImage) {
      try {
        const response = await axios.post("http://140.82.37.244/docs", {
          image: jpgImage,
          // Include any additional data you need to send
        });
        console.log("Response:", response.data);
        // Handle the response (e.g., display success message, fetch files, etc.)
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const RingItem: React.FC<RingItemProps> = ({ ring, index }) => {
    console.log("ring", ring);

    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ring",
      item: { index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    // Create a ref for the Image component
    const imageRef = useRef<HTMLImageElement>(null);

    // Use useEffect to apply the drag ref
    useEffect(() => {
      if (imageRef.current) {
        drag(imageRef);
      }
    }, [drag]);

    return (
      <div>
        <Image
          ref={imageRef}
          src={ring?.src}
          alt={`Ring ${index}`}
          className={styles.ringItem}
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: "move",
          }}
          width={300}
          height={300}
        />
      </div>
    );
  };

  const convertToJpg = async (image: string | null): Promise<string | null> => {
    if (!image) return null;

    return new Promise((resolve, reject) => {
      const img = new window.Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Unable to get 2D context"));
          return;
        }

        context.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg")); // Convert to JPG
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = image;
    });
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
