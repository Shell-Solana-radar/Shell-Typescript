"use client";

import { WalletButton } from "../solana/solana-provider";
import * as React from "react";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountChecker } from "../account/account-ui";
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from "../cluster/cluster-ui";
import { toast } from "react-toastify";
// import { AccountDetailFeature } from "../account/account-ui";
import styles from "./UiLayout.module.css";
import { RingImg } from "@/public/assets/images";
import Footer from "../Footer-Folder/Footer";
import Image from "next/image";
export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className={`h-full flex flex-col ${styles.UiLayout_Div}`}>
      <div className="navbar bg-base-300 text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0">
        <div className="flex-1">
          {/* <Link className="btn btn-ghost normal-case text-xl" href="/"></Link> */}
        </div>
        <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
          <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center justify-between w-full">
              <a
                className="flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80"
                href="#"
                aria-label="Brand"
              >
                <span className="inline-flex items-center gap-x-2 text-xl font-semibold dark:text-white">
                  <Image
                    className="w-10 h-auto rounded-full"
                    src={RingImg}
                    alt="Logo"
                    width={100}
                    height={100}
                  />
                  AR
                </span>
              </a>
              <div className="flex">
                <div className={styles.wallet_div_mobile}>
                  <WalletButton />
                </div>
                <div className="sm:hidden flex items-center">
                  <button
                    type="button"
                    className="hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                    id="hs-navbar-example-collapse"
                    aria-expanded="false"
                    aria-controls="hs-navbar-example"
                    aria-label="Toggle navigation"
                    data-hs-collapse="#hs-navbar-example"
                  >
                    <svg
                      className="hs-collapse-open:hidden shrink-0 size-4"
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
                      <line x1={3} x2={21} y1={6} y2={6} />
                      <line x1={3} x2={21} y1={12} y2={12} />
                      <line x1={3} x2={21} y1={18} y2={18} />
                    </svg>
                    <svg
                      className="hs-collapse-open:block hidden shrink-0 size-4"
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="sr-only">Toggle navigation</span>
                  </button>
                </div>
              </div>
            </div>
            <div
              id="hs-navbar-example"
              className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
              aria-labelledby="hs-navbar-example-collapse"
            >
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
                {links.map(({ label, path }) => (
                  <li key={path} className="list-none">
                    <Link
                      className={pathname.startsWith(path) ? "active" : ""}
                      href={path}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <div className={styles.wallet_div_mobile}>
                  <ClusterUiSelect />
                </div>
              </div>
            </div>
            <div className={styles.wallet_div_desktop}>
              <WalletButton />
              <ClusterUiSelect />
            </div>
          </nav>
        </header>
      </div>
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      <div className="w-auto">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        {/* <Toaster
          position="top-right"
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        /> */}
      </div>
      <Footer />
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === "string" ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
