import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold font-display text-foreground">
            StudioGloss
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Planos
            </Link>
            <a href="#funcionalidades" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Funcionalidades
            </a>
            <a href="#sobre" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Sobre
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.tipo === 'super_admin' && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/super-admin" className="flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button variant="accent" size="sm" asChild>
                  <Link to="/pricing" className="flex items-center">
                    Teste Grátis
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50 bg-background/95 backdrop-blur-md">
            <Link 
              to="/pricing" 
              className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Planos
            </Link>
            <a 
              href="#funcionalidades" 
              className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Funcionalidades
            </a>
            <a 
              href="#sobre" 
              className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </a>
            
            <div className="pt-4 space-y-2 border-t border-border/50">
              {user ? (
                <>
                  {profile?.tipo === 'super_admin' && (
                    <Link to="/super-admin" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <Crown className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/pricing" onClick={() => setIsOpen(false)}>
                    <Button variant="accent" size="sm" className="w-full">
                      Teste Grátis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};