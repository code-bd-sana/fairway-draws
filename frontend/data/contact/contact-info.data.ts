import { ContactInfoCardItem } from "../../types/contact.types";

export const CONTACT_INFO_ITEMS: ContactInfoCardItem[] = [
  {
    id: "email",
    title: "Email Support",
    description: "Get in touch via email.",
    value: "win@fairwaydraws.com",
    href: "mailto:win@fairwaydraws.com",
    type: "email",
  },
  {
    id: "whatsapp",
    title: "WhatsApp Support",
    description: "Chat directly with Fairway Draws Support on WhatsApp.",
    value: "+44 (0) 7984 594833",
    href: "https://wa.me/447984594833?text=Hello%20Fairway%20Draws%20Support%2C%20I%20have%20an%20inquiry",
    type: "whatsapp",
  },
  {
    id: "time",
    title: "Response Time",
    description: "Average turnaround time.",
    value: "Within 24 hours",
    type: "time",
  },
  
];
