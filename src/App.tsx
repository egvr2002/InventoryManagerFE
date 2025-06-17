import { Button } from './components/ui/button';

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-gradient-to-b from-white via-gray-200 to-gray-300">
      <h1 className="text-2xl font-thin">Hello world!</h1>
      <Button>Click me</Button>
    </div>
  );
}
