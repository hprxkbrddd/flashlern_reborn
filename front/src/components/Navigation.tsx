import { Button } from "./ui/button";
import { GraduationCap } from "lucide-react";

interface NavigationProps {
  activeSection: string;
}

export function Navigation({ activeSection }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Главная" },
    { id: "about", label: "О приложении" },
    { id: "features", label: "Возможности" },
    { id: "pricing", label: "Тарифы" },
    { id: "contact", label: "Контакты" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("home")}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-600">FlashLearn</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 shadow-sm hover:shadow-md transition-shadow">
            <a href="/login" aria-label="Перейти на страницу входа">
              Войти
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
