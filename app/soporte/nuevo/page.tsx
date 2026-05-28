import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import Topbar from '../../components/Topbar';
import TicketForm from './TicketForm';
import styles from '../soporte.module.css';

export default async function NuevoTicketPage() {
  const session = await getSession();
  if (!session.accountId || !session.userid) redirect('/cuenta/login');

  return (
    <>
      <Topbar active="soporte" />
      <main className={styles.shell}>
        <div className={styles.containerNarrow}>
          <Link href="/soporte" className={styles.backLink}>← Mis tickets</Link>
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Nuevo ticket</h1>
            <p className={styles.subtitle}>Rellena el formulario para abrir un ticket de soporte.</p>
          </div>
          <TicketForm />
        </div>
      </main>
    </>
  );
}
