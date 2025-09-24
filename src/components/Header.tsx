import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold font-display text-foreground">
              Gloss
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#recursos" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Recursos
            </a>
            <a href="#planos" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Planos
            </a>
            <a href="#contato" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Contato
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="minimal" size="sm">
              Login
            </Button>
            <Button variant="accent" size="sm">
              Começar Grátis
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};