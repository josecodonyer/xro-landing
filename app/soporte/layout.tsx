import Topbar from '../components/Topbar';

export default function SoporteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar active="soporte" />
      {children}
    </>
  );
}
