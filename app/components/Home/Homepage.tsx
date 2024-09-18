import React from "react";
import styles from "./Homepage.module.css";
import {
  phantomImg,
  arrowImg,
  cardCircleImg,
} from "../../../public/assets/images";
import Partners from "../PartnersMarquue/Parthners";
import Image from "next/image";
export default function Homepage() {
  return (
    <div>
      <div className={styles.Homepage}>
        <div className={styles.features_div}>
          {" "}
          <section className={styles.features}>
            <Image
              width={200}
              height={200}
              src={phantomImg}
              alt="phantom Img"
            />
            <div>
              <b> Modern Health </b> <br />
              <p>now live on solana</p>
              <h4>
                <b>99%</b> accuracy in ai program
              </h4>
              <Image
                width={200}
                height={200}
                src={cardCircleImg}
                alt="card circle Img"
                className={styles.card_circle}
              />
            </div>
            <Image
              width={200}
              height={200}
              src={arrowImg}
              alt="Link Img"
              className={styles.arrowImg}
            />
          </section>{" "}
          <section className={styles.features}>
            <Image
              width={200}
              height={200}
              src={phantomImg}
              alt="phantom Img"
            />
            <div>
              <b> Modern Health </b> <br />
              <p>now live on solana</p>
              <h4>
                <b>99%</b> accuracy in ai program
              </h4>
              <Image
                width={200}
                height={200}
                src={cardCircleImg}
                alt="card circle Img"
                className={styles.card_circle}
              />
            </div>
            <Image
              width={200}
              height={200}
              src={arrowImg}
              alt="Link Img"
              className={styles.arrowImg}
            />
          </section>{" "}
        </div>
        <section className={styles.center_text}>
          <h2 className={styles.exporeH2}>Explore Modern Health Plans with</h2>
          <h1 className={styles.exporeH1}>Space Grotesk</h1>
          <p className={styles.explore_P}>
            Use AI to find and manage the best health coverage for your business
            needs and budget.
          </p>

          <div className={styles.button_div}>
            <button className={styles.button_login}>
              Activate Your Account
            </button>{" "}
            <button className={styles.button_open}>
              {" "}
              <Image
                width={200}
                height={200}
                src={phantomImg}
                alt="phantom Img"
              />{" "}
              Sign Up with Phantom
            </button>
          </div>
        </section>{" "}
        <div className={styles.features_div}>
          <section className={styles.features}>
            <Image
              width={200}
              height={200}
              src={phantomImg}
              alt="phantom Img"
            />
            <div>
              <b> Modern Health </b> <br />
              <p>now live on solana</p>
              <h4>
                <b>99%</b> accuracy in ai program
              </h4>
              <Image
                width={200}
                height={200}
                src={cardCircleImg}
                alt="card circle Img"
                className={styles.card_circle_Left}
              />
            </div>
            <Image
              width={200}
              height={200}
              src={arrowImg}
              alt="Link Img"
              className={styles.arrowImg}
            />
          </section>{" "}
          <section className={styles.features}>
            <Image
              width={200}
              height={200}
              src={phantomImg}
              alt="phantom Img"
            />
            <div>
              <b> Modern Health </b> <br />
              <p>now live on solana</p>
              <h4>
                <b>99%</b> accuracy in ai program
              </h4>
              <Image
                width={200}
                height={200}
                src={cardCircleImg}
                alt="card circle Img"
                className={styles.card_circle_Left}
              />
            </div>
            <Image
              width={200}
              height={200}
              src={arrowImg}
              alt="Link Img"
              className={styles.arrowImg}
            />
          </section>{" "}
        </div>
      </div>{" "}
      <Partners />
    </div>
  );
}
