import Image from "next/image";
import Link from "next/link";

export function PetFocusedSection() {
  return (
    <section className="py-32 px-4 font-rubik max-w-7xl mx-auto">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-gray-800 mb-4">Ние сме тука за вас</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Нашата мисија е да создадеме среќни приказни помеѓу миленичињата и нивните сопственици
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-lg font-medium mb-3">Контактирајте нѐ</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Секогаш сме достапни за вашите прашања. Без разлика дали е преку чат или е-пошта, тука сме да помогнеме!
            </p>
            <Link href="/contact" className="text-primary font-medium hover:underline text-sm mb-6">
              Контактирајте нѐ &rarr;
            </Link>
            <div className="mt-auto">
              <Image src="/icons/contact.svg" alt="Contact illustration" width={280} height={280} className="opacity-80" />
            </div>
          </div>

          {/* Feedback Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-lg font-medium mb-3">Вашето мислење е важно</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Нашите корисници и нивните крзнени пријатели се на прво место. Споделете ги вашите предлози со нас!
            </p>
            <Link href="/feedback" className="text-primary font-medium hover:underline text-sm mb-6">
              Споделете мислење &rarr;
            </Link>
            <div className="mt-auto">
              <Image src="/icons/feedback.svg" alt="Feedback illustration" width={200} height={200} className="opacity-80" />
            </div>
          </div>

          {/* Pet Care Card */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-lg font-medium mb-3">Со љубов кон миленичињата</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Добросостојбата на миленичињата е наш приоритет. Работиме за да обезбедиме безбедна платформа за секое животинче.
            </p>
            {/* <Link href="/about" className="text-primary font-medium hover:underline text-sm mb-6">
              Дознајте повеќе &rarr;
            </Link> */}
            <div className="mt-auto">
              <Image src="/icons/love.svg" alt="Pet care illustration" width={200} height={200} className="opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
