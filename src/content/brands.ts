/**
 * Vehicle makes shown on the Car Key Replacement page, in display order.
 * Each one gets its own page at /car-key-replacement/[slug] with its own
 * introduction and the key types that make may use.
 *
 * Keep claims general: name a manufacturer's immobilizer system only when
 * it is certain, and never claim every model is covered.
 */

import type { KeyTypeId } from "./car-keys";

export type Brand = {
  slug: string;
  name: string;
  /** Section heading above the introduction. */
  heading: string;
  /** Original introduction, written for this make. */
  intro: string[];
  /** Key types this make may use, depending on year and model. */
  keyTypes: KeyTypeId[];
};

export const brands: Brand[] = [
  {
    slug: "gmc",
    name: "GMC",
    heading: "Keys for GMC trucks, vans, and SUVs",
    intro: [
      "Across West Texas, a GMC is often a work vehicle first: a Sierra hauling equipment to a lease site, a Savana full of tools, or a Yukon carrying the whole family. When its key goes missing, the day stops until it's replaced.",
      "Older GM vehicles may use the VATS or Passlock anti-theft systems, while newer Sierras and Yukons use keys and fobs that must be programmed to the truck. Either way, we bring the blanks and programming equipment to wherever it's parked, whether that's a lease road, a job site, or your driveway, so you can skip the tow to the dealership.",
    ],
    keyTypes: ["metal", "transponder", "flip", "smart"],
  },
  {
    slug: "lexus",
    name: "Lexus",
    heading: "Replacement keys and smart fobs for Lexus",
    intro: [
      "Many Lexus models use smart keys that unlock the doors when you touch the handle and start the engine with the push of a button. They're convenient right up until one is lost, and a single replacement through a dealership can mean a long wait.",
      "We program replacement smart keys for many Lexus models, along with transponder keys for older vehicles. Lexus smart keys also hide a small mechanical key for emergencies, and we can cut that too, so your new fob works exactly like the original.",
    ],
    keyTypes: ["metal", "transponder", "smart"],
  },
  {
    slug: "amc",
    name: "AMC",
    heading: "Keys for classic AMC vehicles",
    intro: [
      "American Motors stopped building cars in the late 1980s, but plenty of AMC vehicles are still on the road and in garages: Javelins, Hornets, Gremlins, Eagles, and more, many of them carefully restored. Owners of these classics often find a dealership can't help with keys at all.",
      "AMC vehicles predate transponder chips, so their keys are traditional mechanical keys. We can cut a key to match your locks or ignition, and when no original key exists, we can often make one by decoding a lock. Tell us the year and model and we'll let you know what's possible.",
    ],
    keyTypes: ["metal"],
  },
  {
    slug: "plymouth",
    name: "Plymouth",
    heading: "Keys for Plymouth vehicles",
    intro: [
      "The Plymouth name was retired in 2001, but Voyagers, Neons, Breezes, and classic Plymouths from earlier decades still turn up across West Texas. Keeping one running sometimes means finding someone who still knows how to make keys for it.",
      "Most Plymouths use standard mechanical keys, and some later models use a transponder key that has to be programmed to the vehicle. Call with the year and model, and we'll confirm which kind your Plymouth needs before we head your way.",
    ],
    keyTypes: ["metal", "transponder"],
  },
  {
    slug: "nissan",
    name: "Nissan",
    heading: "New keys for your Nissan, made on-site",
    intro: [
      "From Frontier and Titan pickups to Altimas, Rogues, and Sentras, Nissans are everywhere on West Texas roads. Most Nissans built since the late 1990s use the Nissan Anti-Theft System, known as NATS, which means a new key has to be programmed before the engine will start.",
      "Intelligent Key fobs and remote-head keys are among the Nissan keys we're asked about most. If you still have one working key, it's a good time to add a spare. If every key is gone, in many cases we can still make a new one at your location.",
    ],
    keyTypes: ["metal", "transponder", "remote-head", "smart"],
  },
  {
    slug: "pontiac",
    name: "Pontiac",
    heading: "Keys for Pontiac cars",
    intro: [
      "GM discontinued Pontiac in 2010, so owners of a Grand Prix, G6, Firebird, Vibe, or a classic GTO can't simply walk into a Pontiac dealership anymore. A locksmith is often the easiest way to get a working key.",
      "Older Pontiacs use plain mechanical keys. Many from the late 1980s onward use GM anti-theft systems: some Firebirds and others use VATS keys with a small resistor pellet in the blade, others use Passlock, and later models use transponder keys. We'll identify which system your Pontiac has and make a key that starts it.",
    ],
    keyTypes: ["metal", "transponder"],
  },
  {
    slug: "cadillac",
    name: "Cadillac",
    heading: "Cadillac key and fob replacement",
    intro: [
      "Cadillac keys have changed a lot over the years, from the classic chrome keys of decades past to the keyless smart fobs on a modern Escalade or CT5. What hasn't changed is how inconvenient it is to lose one.",
      "Earlier Cadillacs may use GM's VATS system, with a resistor pellet set into the key blade. Later models use transponder keys, and many recent ones use proximity smart keys with push-button start. We handle key replacement for many Cadillac models, matched to the system your vehicle uses.",
    ],
    keyTypes: ["metal", "transponder", "smart"],
  },
  {
    slug: "hummer",
    name: "Hummer",
    heading: "Keys for Hummer H1, H2, and H3",
    intro: [
      "A Hummer is built to go where other vehicles can't, which also means it can end up a long way from help when a key is lost. Whether it's an H2 parked at a ranch or an H3 at a trailhead, we come to the vehicle instead of the other way around.",
      "The H1 used conventional keys, while the H2 and H3 work with GM's anti-theft systems, so a replacement has to be matched to the system as well as cut. Call with your model and year, and we'll confirm what yours needs.",
    ],
    keyTypes: ["metal", "transponder"],
  },
  {
    slug: "acura",
    name: "Acura",
    heading: "Acura keys and remotes, replaced where you are",
    intro: [
      "Acura drivers tend to keep their vehicles a long time. An MDX, TL, or TSX can rack up a lot of miles, and somewhere along the way a key gets lost, a remote stops working, or the key's plastic head cracks.",
      "Acura remote-head keys combine the key and remote in one piece, and the plastic head takes a beating on a busy key ring. When only the shell is cracked, we can often move your existing electronics into a new one. When the key is lost, we cut and program a replacement on-site for many models.",
    ],
    keyTypes: ["metal", "transponder", "remote-head", "smart"],
  },
  {
    slug: "chrysler",
    name: "Chrysler",
    heading: "Chrysler keys and fobs, programmed on-site",
    intro: [
      "Minivans like the Town & Country and Pacifica, and sedans like the 300, do a lot of daily driving. Many Chrysler vehicles from the late 1990s onward use the Sentry Key immobilizer, so a key that's only cut won't start the engine. It also needs to be programmed.",
      "Some Chrysler keys aren't keys in the traditional sense: a fob-style key plugs into the dash, and newer models start with a push button while the fob stays in your pocket. We program replacements for many of these and cut the emergency key hidden inside, so you can get back on the road without a tow.",
    ],
    keyTypes: ["metal", "transponder", "remote-head", "smart"],
  },
  {
    slug: "mazda",
    name: "Mazda",
    heading: "Mazda key replacement",
    intro: [
      "Mazdas like the Mazda3, Mazda6, CX-5, and CX-9 are built to be driven every day, and many of them use flip keys, where the blade folds into the remote when you're not using it.",
      "Flip keys see a lot of daily handling, so worn hinges, broken blades, and failing buttons are common. We can often replace a broken flip-key shell or blade without replacing the electronics, and when a key is lost, we cut and program a new one on-site for many Mazda models.",
    ],
    keyTypes: ["metal", "transponder", "flip", "smart"],
  },
  {
    slug: "infiniti",
    name: "Infiniti",
    heading: "Infiniti Intelligent Key replacement",
    intro: [
      "Infiniti is Nissan's luxury brand, and its keys share much of the same technology, including the Nissan Anti-Theft System, NATS. That means every replacement key for an Infiniti needs to be programmed to the vehicle before it will start the engine.",
      "On most recent models, from the Q50 to the QX80, the key is an Intelligent Key you never have to take out of your pocket. Each one hides a small emergency key for the door, and we cut that too when we program a replacement fob.",
    ],
    keyTypes: ["metal", "transponder", "smart"],
  },
  {
    slug: "subaru",
    name: "Subaru",
    heading: "Keys for your Subaru",
    intro: [
      "Outbacks, Foresters, Crosstreks, and other Subarus are known for lasting a long time, which means many owners eventually face a worn key, a dead remote, or a spare that went missing years ago.",
      "Many owners put off replacing a missing spare until the last key starts acting up. It's better not to wait: making a spare from a working key is simpler than replacing the only one. We cut and program keys for many Subaru models at your location and test the remote buttons before we leave.",
    ],
    keyTypes: ["metal", "transponder", "remote-head", "smart"],
  },
  {
    slug: "ford",
    name: "Ford",
    heading: "Ford keys, cut and programmed where you're parked",
    intro: [
      "From F-150s and Super Duty pickups to Explorers, Escapes, and Mustangs, Ford keys are some of the most common we replace. Most Fords since the late 1990s use the Passive Anti-Theft System, PATS, which reads a chip in the key before letting the engine start.",
      "Super Duty and F-150 owners often depend on the truck for work, so a lost key means lost hours. We cut and program replacement Ford keys and fobs on-site for many models, which beats waiting on a dealership appointment while the truck sits.",
    ],
    keyTypes: ["metal", "transponder", "remote-head", "flip", "smart"],
  },
  {
    slug: "toyota",
    name: "Toyota",
    heading: "Toyota key replacement on-site",
    intro: [
      "Tacomas, Tundras, 4Runners, Camrys, and Corollas are famous for running for years, and many owners keep them long after the original keys are worn down or gone. Most Toyotas built since the late 1990s need a key with a transponder chip programmed to the vehicle.",
      "Many Toyota trucks and SUVs end up with high miles and well-worn keys. A key with worn cuts can start sticking in the ignition or door long before it fails, so it's worth replacing before it leaves you stranded. We cut and program new Toyota keys for many models right where you're parked, and we can make a spare while we're there.",
    ],
    keyTypes: ["metal", "transponder", "remote-head", "smart"],
  },
  {
    slug: "kia",
    name: "Kia",
    heading: "Kia flip keys and smart keys",
    intro: [
      "Kia has become a common sight across West Texas, from the Soul and Forte to the Sorento, Sportage, and Telluride. Many Kias use flip keys, where the blade folds into the remote, and newer models often use smart keys with push-button start.",
      "Kia flip keys tend to break at the hinge or crack along the case. As long as the electronics still work, a new case is often all you need. Lost the key entirely? We can make a new one for many Kia models without a trip to the dealer.",
    ],
    keyTypes: ["metal", "transponder", "flip", "smart"],
  },
  {
    slug: "isuzu",
    name: "Isuzu",
    heading: "Keys for Isuzu trucks and SUVs",
    intro: [
      "Isuzu stopped selling passenger vehicles in the United States around 2009, but Rodeos, Troopers, Ascenders, and i-Series pickups are still working hard across the region, along with Isuzu commercial trucks.",
      "Without a consumer Isuzu dealer network, finding a replacement key can be frustrating, and keys for older models take some tracking down. Call with your year and model, and we'll tell you honestly what we can do.",
    ],
    keyTypes: ["metal", "transponder"],
  },
  {
    slug: "suzuki",
    name: "Suzuki",
    heading: "Keys for Suzuki vehicles",
    intro: [
      "Suzuki stopped selling cars in the United States in 2012, so owners of an SX4, Grand Vitara, Kizashi, or older Sidekick can no longer turn to a local Suzuki dealership for a new key. A mobile locksmith can fill that gap.",
      "Many of these vehicles are still running well, and a lost key shouldn't be what parks one for good. Give us the year and model when you call, and we'll confirm which key it uses and whether we can make it on-site.",
    ],
    keyTypes: ["metal", "transponder"],
  },
  {
    slug: "jeep",
    name: "Jeep",
    heading: "Jeep keys for the trail and the daily drive",
    intro: [
      "Wranglers, Grand Cherokees, Cherokees, and Gladiators get driven hard, on dirt roads, at the lake, and through ranch gates. Keys get dropped, lost, and broken along the way. Many Jeeps from the late 1990s onward use Chrysler's Sentry Key immobilizer, so a new key has to be programmed before the engine will start.",
      "A Jeep that's lost its key is often parked somewhere inconvenient. We come to it and cut and program a replacement for many Jeep models on the spot, even if that's at the end of a long gravel road.",
    ],
    keyTypes: ["metal", "transponder", "remote-head", "smart"],
  },
];

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}
