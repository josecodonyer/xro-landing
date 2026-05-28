import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import XroLogo from '../../components/XroLogo';
import TicketForm from './TicketForm';
import styles from '../soporte.module.css';

export default async function NuevoTicketPage() {
  const session = await getSession();
  if (!session.accountId || !session.userid) redirect('/cuenta/login');

  return (
    <main className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <Link href="/soporte" className={styles.backLink}>← Mis tickets</Link>
          <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
        </div>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Nuevo ticket</h1>
          <p className={styles.subtitle}>Rellena el formulario para abrir un ticket de soporte.</p>
        </div>
        <TicketForm />
      </div>
    </main>
  );
}
