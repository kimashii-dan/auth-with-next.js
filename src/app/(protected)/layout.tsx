import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-[80%] min-h-screen flex flex-col my-3 gap-5 text-[#d1d0c5] ">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
