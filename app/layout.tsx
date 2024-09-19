import "./globals.css";
import { UiLayout } from "@/components/ui/ui-layout";
import { ClusterProvider } from "../components/cluster/cluster-data-access";
import { SolanaProvider } from "../components/solana/solana-provider";
import { ReactQueryProvider } from "../app/react-query-provider";

export const metadata = {
  title: "RingSizer",
  description: "Generated by create-solana-dapp",
};

const links: { label: string; path: string }[] = [
  { label: "Home", path: "/" },
  { label: "RingSize", path: "/RingSize" },
  { label: "Account", path: "/account" },
  { label: "CustomRing", path: "/customRing" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
