import Topbar from '../components/Topbar';

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      {children}
    </>
  );
}
