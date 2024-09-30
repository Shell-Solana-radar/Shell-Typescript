"use client";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import { drawRing } from "./utilities";
import styles from "./Design.module.css";
import { useCluster } from "../../components/cluster/cluster-data-access";
import { useAnchorProvider } from "../../components/solana/solana-provider";
import { useMemo } from "react";
import {
  getRingInfoProgramId,
  getRingInfoProgram,
} from "../../components/Solana alt/solana-exports";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import { NoCameraImg } from "@/public/assets/images";
// Type definitions
type HandCoordinates = number[][];
// Define a type for valid finger names
type Finger = "thumb" | "indexFinger" | "middleFinger" | "ringFinger" | "pinky";

const RingSizer: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null); // For captured image
  const [ringSize, setRingSize] = useState<number | null>(null);
  const [selectedFinger, setSelectedFinger] = useState<Finger>("indexFinger");
  const [handCoordinates, setHandCoordinates] =
    useState<HandCoordinates | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Store captured image
  const [facingMode, setFacingMode] = useState<string>("user");
  const [cameraError, setCameraError] = useState<string | null>(null); // Camera permission error state

  const provider = useAnchorProvider();
  const { cluster } = useCluster();
  const programId = useMemo(
    () => getRingInfoProgramId(cluster.network),
    [cluster]
  );
  const program = getRingInfoProgram(provider);

  // Define intrinsic camera matrix based on video resolution
  const getCameraMatrix = (videoWidth: number, videoHeight: number) => {
    const f_x = videoWidth; // Assume focal length equals width
    const f_y = videoHeight; // Assume focal length equals height
    const c_x = videoWidth / 2;
    const c_y = videoHeight / 2;

    return [
      [f_x, 0, c_x],
      [0, f_y, c_y],
      [0, 0, 1],
    ]; // 3x3 intrinsic matrix
  };

  // Adjust canvas size to match the webcam video size
  const setCanvasSize = () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
  };

  useEffect(() => {
    const runHandpose = async () => {
      const net = await handpose.load();
      setInterval(() => {
        detect(net);
      }, 100); // Detect hand every 100ms
    };

    const detect = async (net: handpose.HandPose) => {
      if (webcamRef.current?.video?.readyState === 4) {
        const video = webcamRef.current.video;

        // Ensure canvas size is set
        setCanvasSize();

        // Get camera matrix based on video dimensions
        const K = getCameraMatrix(video.videoWidth, video.videoHeight);
        // Detect hand landmarks
        const hands = await net.estimateHands(video);

        if (hands.length > 0) {
          const calibratedHandCoordinates = hands[0].landmarks.map(
            ([x, y, z]) => {
              const projectedX = (K[0][0] * x + K[0][2]) / z;
              const projectedY = (K[1][1] * y + K[1][2]) / z;
              return [projectedX, projectedY];
            }
          );

          setHandCoordinates(calibratedHandCoordinates);

          // Mockup data for ring size (dynamic based on real data)
          const sizes = {
            thumb: 9,
            indexFinger: 7,
            middleFinger: 8,
            ringFinger: 7,
            pinky: 6,
          };

          setRingSize(sizes[selectedFinger]);
        }
      }
    };

    runHandpose();
  }, [selectedFinger]);

  // Draw the ring on the canvas
  useEffect(() => {
    if (handCoordinates) {
      drawRing(handCoordinates, selectedFinger, canvasRef);
    }
  }, [handCoordinates, selectedFinger]);

  const handleCameraError = (error: string) => {
    setCameraError(error);
    toast.error("Camera access denied. Please allow camera permissions.");
  };
  // Check camera permissions
  const checkCameraAccess = async () => {
    try {
      // Try accessing the camera
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraError(null); // Clear any existing error if access is granted
    } catch (error) {
      handleCameraError("Camera access denied.");
    }
  };

  useEffect(() => {
    checkCameraAccess();
  }, []);

  // Capture image from the webcam and display it on a separate canvas
  const captureImage = () => {
    if (!webcamRef.current) {
      handleCameraError("Unable to access the camera");
      toast.error("Camera access denied. Please allow camera permissions.");

      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      handleCameraError(
        "Unable to capture image. Please allow camera permissions."
      );
      return;
    }
    setCapturedImage(imageSrc || null);

    if (captureCanvasRef.current && imageSrc) {
      const ctx = captureCanvasRef.current.getContext("2d");
      const video = webcamRef.current?.video;

      if (ctx && video) {
        captureCanvasRef.current.width = video.videoWidth;
        captureCanvasRef.current.height = video.videoHeight;
        const img = new window.Image();
        img.src = imageSrc;

        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            captureCanvasRef.current!.width,
            captureCanvasRef.current!.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            captureCanvasRef.current!.width,
            captureCanvasRef.current!.height
          );

          if (handCoordinates) {
            drawRing(handCoordinates, selectedFinger, captureCanvasRef, false);
          }
        };
      }
    }
  };
  const storeInfo = async () => {
    console.log("Store Info in Blockchain");
    console.log("Program ID", programId);
    console.log("Program", program);
    console.log("Provider", provider);

    const customer = new Keypair();

    // Generiere einen neuen Schlüssel für die RingInfo
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        customer.publicKey,
        2 * LAMPORTS_PER_SOL
      )
    );

    console.log("Customer", customer.publicKey);
    let startBalancePlayer = await provider.connection.getBalance(
      customer.publicKey
    );
    console.log("Start balance", startBalancePlayer);

    // Definiere den Namen und die Größe des Rings
    const name = "Mona";

    if (ringSize && typeof name === "string") {
      const size: number = ringSize;
      console.log("ringSize", typeof size);
      console.log("name", typeof name);
      // Führe die Transaktion zum Speichern der Ringgröße aus
      console.log("Create ring info account");

      try {
        let tx = await program.methods
          .storeRing(name, size)
          .accounts({
            signer: customer.publicKey,
          })
          .signers([customer])
          .rpc();
        toast.success("Ring size stored successfully");
        console.log("transaction hash", tx);
      } catch (error: any) {
        toast.error(`Error storing ring size: ${error.message}`);
        console.log(`Error storing ring size: ${error.message}`);
      }
    }
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    if (!webcamRef.current) {
      handleCameraError("Unable to access the camera");
      return;
    }
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const videoConstraints = {
    width: 1280,
    height: 920,
    facingMode,
  };

  return (
    <>
      <div className={`container mx-auto ${styles.container}`}>
        <div className={styles.webCamDiv}>
          <div className={styles.webcamContainer}>
            {cameraError && (
              <div className={styles.errorMessage}>
                <Image
                  src={NoCameraImg}
                  alt="NoCameraImg"
                  width={300}
                  height={300}
                />
                <p>Cannot capture image without camera permission.</p>
              </div>
            )}

            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className={styles.webcam}
              audio={false}
              width={1280}
              height={920}
              videoConstraints={videoConstraints}
            />
            <canvas ref={canvasRef} className={styles.overlayCanvas} />
          </div>
          <div className={styles.controls}>
            <div className={styles.fingerDiv}>
              <div>
                <div>
                  <label
                    htmlFor="select-2"
                    className="block text-sm font-medium mb-2 dark:text-white"
                  >
                    Select Finger:
                  </label>
                  <div className="relative">
                    <select
                      onChange={(e) =>
                        setSelectedFinger(e.target.value as Finger)
                      }
                      value={selectedFinger}
                      id="select-2"
                      className="py-3 px-4 pe-16 block w-full border-teal-500 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
                    >
                      <option value="thumb">Thumb</option>
                      <option value="indexFinger">Index Finger</option>
                      <option value="middleFinger">Middle Finger</option>
                      <option value="ringFinger">Ring Finger</option>
                      <option value="pinky">Pinky</option>
                    </select>
                    <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-8">
                      <svg
                        className="shrink-0 size-4 text-teal-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.ringSize}>
              <h3>
                Detected Ring Size: <span>{ringSize ? ringSize : 0}</span>
              </h3>
            </div>

            <div className={styles.buttonDiv}>
              <button className={styles.captureButton} onClick={captureImage}>
                Capture Image
              </button>

              <button
                className={styles.toggleCameraButton}
                onClick={toggleCamera}
              >
                Switch Camera
              </button>

              <button className={styles.storeInfoButton} onClick={storeInfo}>
                Store Info in Blockchain
              </button>
            </div>
          </div>
        </div>

        {capturedImage ? (
          <div className={styles.capturedImageContainer}>
            <h3>Captured Image:</h3>
            <canvas ref={captureCanvasRef} className={styles.capturedCanvas} />
          </div>
        ) : (
          <div className={styles.capturedImageContainer}>
            <p>Your Image will appear here </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RingSizer;
