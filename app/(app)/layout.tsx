import MessageCard from '@/components/MessageCard';
import NavBar from '@/components/NavBar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <NavBar />
      {/* <MessageCard /> */}
      {children}
    </section>
  );
}
