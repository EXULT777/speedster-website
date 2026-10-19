/**
 * Copy for the Car Key Replacement page and the shared parts of each
 * brand page (key types, process, what to have ready).
 */

export type KeyTypeId = "metal" | "transponder" | "remote-head" | "flip" | "smart";

export type KeyType = {
  id: KeyTypeId;
  name: string;
  description: string;
};

export const keyTypes: KeyType[] = [
  {
    id: "metal",
    name: "Standard metal key",
    description: "Precision-cut keys for older vehicles, spare ignition keys, and door keys.",
  },
  {
    id: "transponder",
    name: "Transponder key",
    description:
      "Keys with a chip that talks to your vehicle's immobilizer; we cut the blade and program the chip.",
  },
  {
    id: "remote-head",
    name: "Remote-head key",
    description: "Key and remote in one; we cut, program, and sync both functions.",
  },
  {
    id: "flip",
    name: "Flip key",
    description:
      "Switchblade-style keys that fold into the fob; we replace, cut, and program them.",
  },
  {
    id: "smart",
    name: "Smart key / proximity fob",
    description: "Keyless entry and push-to-start fobs programmed to your vehicle.",
  },
];

export const carKeySteps = [
  { title: "Call us", text: "Call with your vehicle's year, make, and model." },
  { title: "We confirm and dispatch", text: "We confirm the key type and send a technician." },
  { title: "Cut and program on-site", text: "We cut and program your new key on-site." },
  { title: "Test before we leave", text: "We test everything before we leave." },
];

export const whatToHaveReady = {
  heading: "What to have ready",
  items: [
    "Photo ID",
    "Proof of ownership (title or registration)",
    "Your vehicle's location",
  ],
  note: "It's how we keep every vehicle secure.",
};

export const carKeyPage = {
  title: "Car Key Replacement",
  eyebrow: "Car key replacement in Midland, Odessa, Lubbock & Amarillo",
  heading: "Lost your car keys? We'll make new ones — right where you are.",
  intro:
    "Losing your only car key is stressful, especially when you need your vehicle for work. Speedster Lock & Key brings key-cutting and programming equipment to your location, so you can get a working key without towing your vehicle to the dealership. We work on many makes and models of cars, pickups, SUVs, and vans.",
  showroomHeading: "Key Showroom",
  makesHeading: "Makes we work with",
  missingMake:
    "Don't see your vehicle? Call us with the year, make, and model and we'll let you know what we can do.",
};

export const carKeyTeaser = {
  heading: "Lost your car key? Don't call a tow truck.",
  text: "We cut and program replacement keys and smart fobs on-site for many makes and models.",
  button: "See car key replacement",
};
