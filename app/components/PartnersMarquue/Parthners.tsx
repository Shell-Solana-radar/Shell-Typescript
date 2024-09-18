import React from "react";
import Marquee from "react-fast-marquee";
import {
  solflare_img,
  phamtomBg_IMg,
  phantomBh_2,
} from "../../../public/assets/images";
import styles from "./Partners.module.css";
import Image from "next/image";

export default function Partners() {
  return (
    <div className={styles.Parthner_styles}>
      <Marquee>
        <Image src={solflare_img} alt="solflare logo"  width={100} height={100} />
        <Image src={phamtomBg_IMg} alt="Phantom Logo"  width={100} height={100} />
        <Image src={phantomBh_2} alt="Phantom Logo"  width={100} height={100} />
      </Marquee>
    </div>
  );
}
