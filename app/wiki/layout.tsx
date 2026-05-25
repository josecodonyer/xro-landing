import Topbar from '../components/Topbar';

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar active="wiki" subtitle="Wiki" />
      {children}
    </>
  );
}
