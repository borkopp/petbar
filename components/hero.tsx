import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Search} from "lucide-react";

export function Hero() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-[url('/bg-hero2.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          {/* Main Title */}
          <h1 className="text-5xl font-bold mb-4">Пронајди го твоето милениче</h1>
          {/* <p className="text-xl mb-8">Ние сме првиот пазар за миленици во Македонија со онлајн систем за идентификација.</p> */}

          {/* Search Form */}
          <div className="bg-white rounded-xl p-2 shadow-lg max-w-5xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Животно, вид или раса"
                className="w-full h-12 border-0 bg-gray-50 rounded-lg focus:ring-0 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Select>
                <SelectTrigger className="w-full h-12 border-0 bg-gray-50 rounded-lg focus:ring-0 text-gray-900 placeholder:text-gray-500">
                  <SelectValue placeholder="Пазар за миленици" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Сите пазари</SelectItem>
                  <SelectItem value="dogs">Кучиња</SelectItem>
                  <SelectItem value="cats">Мачки</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Град, област или регион"
                className="w-full h-12 border-0 bg-gray-50 rounded-lg focus:ring-0 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 font-medium rounded-lg">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Category Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <CategoryLink icon="🐕" label="Кучиња" />
            <CategoryLink icon="🐈" label="Мачки" />
            <CategoryLink icon="🐎" label="Коњи" />
            <CategoryLink icon="🐾" label="Сите животни" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryLink({icon, label}: {icon: string; label: string}) {
  return (
    <a href="#" className="flex items-center space-x-2 bg-white/90 hover:bg-white text-black px-6 py-3 rounded-full transition-colors">
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
}
