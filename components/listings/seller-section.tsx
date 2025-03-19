
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import Link from "next/link"

interface SellerSectionProps {
  seller: {
    id: string
    full_name: string
    created_at: string
    avatar_url: string | null
  }
  location: string
  phone: string
  listingType: string
}

export default function SellerSection({ seller, location, phone, listingType }: SellerSectionProps) {
  // Format the date to a more readable format
  const memberSince = new Date(seller.created_at).toLocaleDateString('mk-MK', {
    month: 'long',
    year: 'numeric'
  })

  // Format phone number to add spaces between 3 digits
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add spaces after every 3 digits
    return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const formattedPhone = phone ? formatPhoneNumber(phone) : '';

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Информации за продавачот</h2>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-14 w-14">
            <AvatarImage src={seller.avatar_url || undefined} alt={seller.full_name} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{seller.full_name}</p>
            <p className="text-sm text-gray-500">Член од {memberSince}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Локација</p>
            <p className="font-medium">{location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Телефон</p>
            {phone ? (
              <Link 
                href={`tel:${phone}`} 
                className={`font-medium flex items-center ${listingType === "partner" ? "text-secondary" : "text-primary"} hover:underline`}
              >
                {formattedPhone}
              </Link>
            ) : (
              <p className="font-medium">Нема број</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 