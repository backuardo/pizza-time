import { AuthButton } from '../components/auth-button';
import { CreatePizzaModal } from '@/components/create-pizza-modal';

export function Header() {
  return (
    <nav className="navbar flex justify-between rounded-xl">
      <h1 className="font-black text-3xl text-accent">PizzaTime</h1>
      <div className="space-x-4">
        <CreatePizzaModal />
        <AuthButton />
      </div>
    </nav>
  );
}
