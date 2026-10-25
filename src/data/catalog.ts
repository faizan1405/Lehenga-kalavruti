// TEMPORARY DEMO CONTENT — replace images, names, copy, prices, colours, crafts and Navratri
// associations with verified Kalavruti information before publishing.
import hero from "@/assets/l-hero.jpg";
import night from "@/assets/l-night.jpg";
import mirror from "@/assets/l-mirror-macro.jpg";
import blouse from "@/assets/l-blouse.jpg";
import border from "@/assets/l-border.jpg";
import dupatta from "@/assets/l-dupatta.jpg";
import rani from "@/assets/l-rani.jpg";
import emerald from "@/assets/l-emerald.jpg";
import kesari from "@/assets/l-kesari.jpg";
import indigo from "@/assets/l-indigo.jpg";
import maroon from "@/assets/l-maroon.jpg";
import purple from "@/assets/l-purple.jpg";
import turquoise from "@/assets/l-turquoise.jpg";
import ivory from "@/assets/l-ivory.jpg";
import yellow from "@/assets/l-yellow.jpg";

export const images = { hero, night, mirror, blouse, border, dupatta };

export type Collection = { slug: string; name: string; tagline: string; description: string; image: string };

export const collections: Collection[] = [
  { slug: "navratri-2026", name: "Navratri 2026", tagline: "Nine nights, one celebration", description: "The new Navratri collection — colour, mirror work and skirts made to fly.", image: hero },
  { slug: "the-garba-edit", name: "The Garba Edit", tagline: "Made to move", description: "Lehengas designed for colour, movement and nights that don't stand still.", image: kesari },
  { slug: "dandiya-nights", name: "Dandiya Nights", tagline: "Deep colour, late nights", description: "Rich jewel tones and statement dupattas for the longest nights of the festival.", image: indigo },
  { slug: "the-festive-edit", name: "The Festive Edit", tagline: "Sangeet, wedding, celebration", description: "Elevated silhouettes and detailed finishing for every celebration after Navratri.", image: ivory },
];

export const colours = [
  { name: "Rani Pink", hex: "#c2185b" },
  { name: "Kesari", hex: "#e8731a" },
  { name: "Emerald", hex: "#11603f" },
  { name: "Indigo", hex: "#272a78" },
  { name: "Maroon", hex: "#7a1424" },
  { name: "Purple", hex: "#4f1f6b" },
  { name: "Turquoise", hex: "#0f6e7a" },
  { name: "Yellow", hex: "#e3a612" },
  { name: "Ivory", hex: "#efe4cf" },
] as const;

export const occasions = ["Navratri", "Garba Night", "Dandiya Night", "Festive", "Wedding", "Sangeet", "Bridesmaid", "Celebration"];
export const crafts = ["Mirror Work", "Embroidery", "Bandhani Inspired", "Thread Work", "Sequin Detail", "Gota Details"];

export type Spec = { label: string; value: string }[];
export type Product = {
  slug: string; name: string; type: string; collection: string; colour: string; price: number;
  occasions: string[]; crafts: string[]; description: string; images: string[];
  lehenga: Spec; blouse: Spec; dupatta: Spec;
  /** kept for the detail viewer */
  details: Spec;
};

const mk = (o: { slug: string; name: string; collection: string; colour: string; price: number; img: string; flare: string; kalis: string; work: string; occasions: string[]; crafts: string[]; description: string }): Product => {
  const lehenga = [
    { label: "Fabric", value: "Silk Blend" }, { label: "Colour", value: o.colour }, { label: "Flare", value: o.flare },
    { label: "Kalis", value: o.kalis }, { label: "Work", value: o.work }, { label: "Waist", value: "Adjustable, drawstring with tassels" },
    { label: "Length", value: "42 in" }, { label: "Lining", value: "Soft cotton lining" }, { label: "Closure", value: "Side zip + drawstring" },
  ];
  const blouse = [
    { label: "Fabric", value: "Silk Blend" }, { label: "Work", value: o.work }, { label: "Neckline", value: "Sweetheart" },
    { label: "Sleeves", value: "Elbow length" }, { label: "Back", value: "Deep back with tie-up dori" }, { label: "Padding", value: "Lightly padded" },
    { label: "Closure", value: "Back hooks" }, { label: "Blouse length", value: "14 in" },
  ];
  const dupatta = [
    { label: "Fabric", value: "Soft Net" }, { label: "Length", value: "2.5 m" }, { label: "Width", value: "1 m" },
    { label: "Border", value: "Embroidered mirror border" }, { label: "Embroidery", value: "Scattered motifs" }, { label: "Finishing", value: "Hand-finished edges" },
  ];
  return {
    ...o, type: "Lehenga Set", images: [o.img, blouse_img, border_img, mirror_img, dupatta_img],
    lehenga, blouse, dupatta,
    details: [{ label: "Finish", value: "Hand-finished border" }, { label: "Texture", value: o.work }, { label: "Technique", value: o.work }, { label: "Drape", value: o.flare }],
  };
};
const blouse_img = blouse, border_img = border, mirror_img = mirror, dupatta_img = dupatta;

export const products: Product[] = [
  mk({ slug: "meher", name: "Meher", collection: "navratri-2026", colour: "Rani Pink", price: 48500, img: rani, flare: "6 m", kalis: "24 kalis", work: "Mirror & thread embroidery", occasions: ["Navratri", "Garba Night"], crafts: ["Mirror Work", "Thread Work"], description: "Rani pink alive with mirror work — built for the first beat of the dhol." }),
  mk({ slug: "aabha", name: "Aabha", collection: "the-garba-edit", colour: "Kesari", price: 42000, img: kesari, flare: "8 m", kalis: "32 kalis", work: "Mirror & gota detailing", occasions: ["Garba Night", "Navratri"], crafts: ["Mirror Work", "Gota Details"], description: "Eight metres of kesari, made to open like a flame mid-spin." }),
  mk({ slug: "ziya", name: "Ziya", collection: "navratri-2026", colour: "Emerald", price: 52000, img: emerald, flare: "6 m", kalis: "24 kalis", work: "Mirror & multicolour embroidery", occasions: ["Navratri", "Festive"], crafts: ["Mirror Work", "Embroidery"], description: "Emerald, scattered with mirrors that catch every lantern." }),
  mk({ slug: "noor", name: "Noor", collection: "dandiya-nights", colour: "Indigo", price: 46500, img: indigo, flare: "5 m", kalis: "20 kalis", work: "Silver mirror work", occasions: ["Dandiya Night", "Sangeet"], crafts: ["Mirror Work"], description: "Midnight indigo and silver — for the hours after the crowd thins." }),
  mk({ slug: "ira", name: "Ira", collection: "the-garba-edit", colour: "Maroon", price: 39500, img: maroon, flare: "7 m", kalis: "28 kalis", work: "Bandhani-inspired print with gota", occasions: ["Garba Night", "Navratri"], crafts: ["Bandhani Inspired", "Gota Details"], description: "Maroon and sindoor panels that bloom with every turn." }),
  mk({ slug: "vasudha", name: "Vasudha", collection: "dandiya-nights", colour: "Purple", price: 55000, img: purple, flare: "6 m", kalis: "24 kalis", work: "Zari, thread & mirror work", occasions: ["Dandiya Night", "Wedding"], crafts: ["Embroidery", "Mirror Work"], description: "Royal purple traced in turquoise and gold — regal, but ready to dance." }),
  mk({ slug: "rooh", name: "Rooh", collection: "navratri-2026", colour: "Turquoise", price: 49000, img: turquoise, flare: "6 m", kalis: "24 kalis", work: "Kutchi-inspired embroidery", occasions: ["Navratri", "Garba Night"], crafts: ["Embroidery", "Mirror Work"], description: "Turquoise with rani pink embroidery — Gujarat, reimagined." }),
  mk({ slug: "navya", name: "Navya", collection: "the-garba-edit", colour: "Yellow", price: 41500, img: yellow, flare: "8 m", kalis: "32 kalis", work: "Mirror & thread embroidery", occasions: ["Garba Night", "Festive"], crafts: ["Mirror Work", "Sequin Detail"], description: "Marigold yellow with pink accents, light enough to spin all night." }),
  mk({ slug: "aarna", name: "Aarna", collection: "the-festive-edit", colour: "Ivory", price: 58000, img: ivory, flare: "6 m", kalis: "24 kalis", work: "Multicolour Kutchi-inspired embroidery", occasions: ["Wedding", "Sangeet", "Celebration"], crafts: ["Embroidery", "Mirror Work"], description: "Ivory as a canvas for every colour of the festival." }),
];

export const journal = [
  { slug: "nine-nights", title: "Nine Nights, Nine Colours", excerpt: "A styling guide for every night of Navratri.", image: night, date: "Navratri 2026" },
  { slug: "mirror-work", title: "Why Mirror Work Catches the Light", excerpt: "A closer look at the embroidery that makes Garba glow.", image: mirror, date: "Navratri 2026" },
  { slug: "the-flare", title: "Kalis, Flare and the Perfect Spin", excerpt: "What makes a lehenga move the way it does.", image: border, date: "Festive 2026" },
];

export const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const byColour = (c: string) => products.find((p) => p.colour === c);
