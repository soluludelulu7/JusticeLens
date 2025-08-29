import { Logo } from '@/components/justicelens/Logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {children}
      </main>
    </div>
  )
}
