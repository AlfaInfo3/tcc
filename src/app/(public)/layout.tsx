import Footer from "@/components/books/footer";
import { PublicNav } from "@/components/PublicNav";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PublicNav />
      <main>
        {children}
      </main>
      <footer className="flex-1">
        <Footer/>
      </footer>
    </div>
  );
}
