/**
 * Long-form copy for each sub-service page (/services/[category]/[service]):
 * what the service is, common situations, how we handle it, and the steps.
 * Keyed by "category/slug" because High-Security Locks exists in both
 * Residential and Commercial with different copy.
 */

import { site } from "./site";

export type ServiceDetail = {
  /** Opening paragraphs: what the service is. */
  intro: string[];
  situationsHeading: string;
  situations: string[];
  approachHeading: string;
  approach: string[];
  /** 3–4 steps shown in the "How it works" section. */
  stepsHeading: string;
  steps: { title: string; text: string }[];
};

const hours = site.hours.sentence;

export const serviceDetails: Record<string, ServiceDetail> = {
  /* ---------------------------------------------------------------- */
  /* Residential                                                       */
  /* ---------------------------------------------------------------- */
  "residential/home-lockout": {
    intro: [
      "A home lockout usually happens at the worst moment: the door swings shut behind you while you take out the trash, the keys are sitting on the kitchen counter, or a key snaps off in the deadbolt after a long day. Whatever the cause, you need to get back inside without turning a small problem into an expensive repair.",
      "That's what our home lockout service is for. A technician comes to your door with professional entry tools and works to open it the way a locksmith should — carefully, and without drilling or prying unless there's truly no other option.",
    ],
    situationsHeading: "When homeowners call us",
    situations: [
      "Keys left inside after the door locked behind you",
      "A key broken off inside the lock",
      "A deadbolt or knob that won't turn even with the right key",
      "Lost keys, or keys that went missing after a move",
      "A rental or new home where you were never given a working key",
    ],
    approachHeading: "How we get you back inside",
    approach: [
      "When you call, we ask where you are and what kind of lock is on the door, so the technician arrives with the right tools. On site, we start with non-destructive methods such as picking or bypass tools designed to open the lock without damaging the door, frame, or hardware. Most lockouts can be handled this way.",
      "Before we open any door, we'll ask for photo ID and something showing you live there or are authorized to be there, such as a lease, a utility bill, or mail with your name and address. It's a quick step that protects you as much as anyone.",
      "Once you're inside, we can cut a spare key, retrieve a broken key, or rekey the lock if your keys were lost or stolen, so you leave with a door that's secure again. We handle home lockouts across Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Back inside in four steps",
    steps: [
      { title: "Call us", text: "Tell us your address and what kind of lock is on the door." },
      { title: "Confirm who you are", text: "Our technician checks your ID and proof that you live there." },
      { title: "Careful entry", text: "We open the door with methods designed to avoid damage." },
      { title: "Secure it again", text: "Need a spare, a repair, or a rekey? We can handle it before we leave." },
    ],
  },

  "residential/emergency-lockout": {
    intro: [
      "Some lockouts can wait an hour. Others can't: food is on the stove, medicine is inside, a toddler is on the other side of the door, or the weather is turning and you have nowhere to go. Our emergency lockout service is for the moments when getting back in is urgent.",
      `When you tell us it's an emergency, we treat it as a priority and get the nearest available technician moving your way. We take calls ${hours}.`,
    ],
    situationsHeading: "What counts as an emergency",
    situations: [
      "A child, an elderly family member, or a pet alone inside",
      "Something running inside, like a stove, oven, or bath",
      "Medication or medical equipment locked inside",
      "Being stranded outside late at night or in extreme heat or cold",
      "A door that won't lock after a break-in or forced entry",
    ],
    approachHeading: "How we handle urgent calls",
    approach: [
      "If anyone's safety is at risk — a child alone with something on the stove, a person who needs medical help, or smoke or fire — call 911 first. Emergency services can force entry immediately. Once everyone is safe, we can repair or secure the door.",
      "For every other urgent lockout, call us directly rather than sending a message, so we can get details and dispatch right away. Tell us exactly where you are and what's going on. The technician arrives ready to open the door with careful entry methods, and checks ID and proof of residence before opening it.",
      "If your door or lock was damaged, whether in a break-in or by an earlier attempt to get inside, we can repair it, replace the hardware, or make it secure for the night so you're not left with a door that won't lock. We cover emergency lockouts in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "What happens when you call",
    steps: [
      { title: "Call, don't message", text: "Phone us so we can get the details and dispatch right away." },
      { title: "Technician on the way", text: "The nearest available locksmith heads to your location." },
      { title: "Open and secure", text: "We get you inside and make sure the door locks properly again." },
    ],
  },

  "residential/lock-rekey": {
    intro: [
      "Rekeying changes which key operates a lock without replacing the lock itself. Inside every pin-tumbler cylinder is a set of small pins cut to match one specific key. When we rekey, we take the cylinder apart, swap those pins for a new set, and cut you new keys. The old keys stop working, and your existing hardware stays on the door.",
      "Because you keep the lock you already have, rekeying often costs less than buying new hardware, and it's one of the simplest ways to take back control of who can get into your home.",
    ],
    situationsHeading: "Good times to rekey",
    situations: [
      "You just bought or moved into a home and don't know who still has keys",
      "A key was lost or stolen",
      "A roommate, tenant, contractor, or ex still has a copy",
      "You'd like one key to open the front door, back door, and garage",
      "You're a landlord turning over a unit between tenants",
    ],
    approachHeading: "How we rekey your locks",
    approach: [
      "We start by checking the condition of each lock. If a lock is worn out, damaged, or a low-quality model that won't stay reliable, we'll tell you, and you can decide whether to rekey it anyway or replace it. If it's in good shape, rekeying is usually the better choice.",
      "We rekey the cylinders on site, test each one with the new keys, and make sure the door locks and unlocks smoothly. If you'd like several doors to work with the same key, we can key them alike as long as the locks share a compatible keyway. You'll get your new keys before we leave.",
      "Homeowners, renters with landlord approval, and property managers in Midland, Odessa, Lubbock, and Amarillo call us to rekey after moves, lost keys, and tenant changes.",
    ],
    stepsHeading: "How a rekey works",
    steps: [
      { title: "Count your locks", text: "Tell us how many doors and whether you want them keyed alike." },
      { title: "Inspect", text: "We check each lock and let you know if any should be replaced instead." },
      { title: "Rekey and test", text: "New pins, new keys, and a test on every door before we go." },
    ],
  },

  "residential/lock-installation": {
    intro: [
      "A lock only protects your home if it's the right lock for the door and it's installed correctly. A deadbolt that doesn't fully extend, a strike plate held on with short screws, or a latch that drags against the frame all weaken an otherwise good lock.",
      "We install and replace deadbolts, knob and lever sets, handle sets, keypad locks, and smart locks, and we fit them so they line up, latch cleanly, and turn smoothly for years.",
    ],
    situationsHeading: "Why people change their locks",
    situations: [
      "Old, worn, or damaged locks that no longer feel secure",
      "Upgrading to a deadbolt, keypad, or smart lock",
      "Matching hardware after a remodel or a new door",
      "Repairing a door after a break-in",
      "Setting up several doors to work with one key",
    ],
    approachHeading: "How we install new locks",
    approach: [
      "We'll talk through what you want from the new lock — more security, keyless entry, a better look, or one key for every door — and recommend hardware that fits your door and your budget. If you've already bought a lock, we're happy to install it, and we'll let you know if it isn't a good fit for the door.",
      "During installation we check the door's alignment, bore and latch sizes, and the strike plate. Where it makes sense, we reinforce the strike with longer screws that reach the framing behind the door jamb, which helps the door resist being kicked in. Smart locks get set up and tested with you, including how to use the backup key or code.",
      "When we finish, every lock is tested several times so it locks smoothly and you know exactly how it works. We install locks for homes throughout Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "From choosing to installed",
    steps: [
      { title: "Pick the hardware", text: "We help you choose, or install the lock you already bought." },
      { title: "Fit the door", text: "We check alignment and the strike so the lock works as designed." },
      { title: "Install and test", text: "Everything is fitted, tested, and explained before we leave." },
    ],
  },

  "residential/lock-repair": {
    intro: [
      "Locks wear out slowly. A key starts to stick, a knob gets wobbly, or the deadbolt only turns if you pull the door just right. It's easy to live with until the day the lock won't open at all.",
      "Many of these problems can be repaired rather than replaced. Our lock repair service finds what's actually wrong and fixes it, and we only recommend new hardware when a repair won't last. Catching a problem early is usually simpler than dealing with a lock that fails completely.",
    ],
    situationsHeading: "Problems we repair",
    situations: [
      "Keys that stick, are hard to turn, or only work at a certain angle",
      "Loose or wobbly knobs, levers, and handle sets",
      "Deadbolts that won't extend or retract fully",
      "Latches that don't catch, or doors that won't stay closed",
      "Locks damaged in a break-in or by a forced-entry attempt",
    ],
    approachHeading: "How we fix it",
    approach: [
      "Not every lock problem starts in the lock. A door that has sagged on its hinges, a misaligned strike plate, or a frame that has shifted with the seasons can make a perfectly good lock bind. We check the door and frame first, because adjusting a strike or tightening a hinge is often the real fix.",
      "When the problem is inside the lock, we clean, lubricate, and adjust the mechanism, replace worn springs or parts where they're available, and make sure your key is cut properly. A badly worn key can feel like a broken lock, so we may cut a fresh key from the lock itself.",
      "If the lock really is past saving, we'll explain why and show you replacement options, so the choice is yours. We repair locks for homeowners and renters in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "How a repair goes",
    steps: [
      { title: "Describe the problem", text: "Tell us what the lock is doing, or not doing." },
      { title: "Find the cause", text: "We check the door, frame, key, and lock to find the real issue." },
      { title: "Repair or advise", text: "We fix it on the spot, or explain your options if it can't be saved." },
    ],
  },

  "residential/key-duplication": {
    intro: [
      "A spare key is cheap insurance against a lockout, but only if it works. Copies cut in a hurry often stick, or need jiggling, or fail altogether, and you don't find out until the day you need them.",
      "We cut duplicate keys for most standard house keys and test them in your locks, so you know they work before you hand one to a family member, roommate, dog walker, or neighbor.",
    ],
    situationsHeading: "Common reasons for a spare",
    situations: [
      "Extra keys for family members or roommates",
      "A spare for a trusted neighbor or a hidden lockbox",
      "Keys for a house sitter, cleaner, or caregiver",
      "Replacing a worn key that's starting to stick",
      "Keys for a garage side door, shed, or gate",
    ],
    approachHeading: "How we cut your keys",
    approach: [
      "Bring us your best original key whenever possible. A copy of a copy picks up small errors each time, and a worn key can produce a worn duplicate. If all your keys are worn, we can often cut a fresh key that matches the lock, rather than the worn key.",
      "Because we come to you, we can test every new key in the actual lock right away and make adjustments if anything feels off. If you'd like fewer keys on your ring, ask about rekeying several doors to work with one key. It's a simple change that makes life easier for everyone in the house, and it means a spare for one door is a spare for all of them.",
      "Some high-security keys are restricted and can only be copied with the owner's authorization, through the system they belong to. If you have one of those, we'll explain what's needed. We cut spare keys for homes in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Getting a spare",
    steps: [
      { title: "Bring your best key", text: "An original key gives the most accurate copy." },
      { title: "We cut it", text: "Precision-cut copies for most standard house keys." },
      { title: "Test in the lock", text: "We try each new key in your door before we leave." },
    ],
  },

  "residential/high-security-locks": {
    intro: [
      "Standard residential locks keep honest people honest, but many can be picked or bumped open by someone who knows how, and their keys can be copied at almost any hardware store. High-security locks are built to close those gaps.",
      "They use more complex internal mechanisms that resist picking and bumping, hardened parts that resist drilling, and often restricted keys that can't be copied without authorization. For front doors, back doors, and anywhere you keep valuables, they're a meaningful upgrade. They look much like ordinary locks from the outside, so you get the extra protection without changing the look of your doors.",
    ],
    situationsHeading: "Who upgrades to high-security locks",
    situations: [
      "Homeowners after a break-in or attempted break-in",
      "Anyone who has lost track of how many copies of a key exist",
      "Homes with valuables, firearms, or important documents",
      "Rental owners who want tighter control over keys",
      "People who travel often or leave a home empty for long periods",
    ],
    approachHeading: "How we upgrade your security",
    approach: [
      "We start by looking at your doors as a whole. A high-security lock on a weak door or a flimsy strike plate isn't much better than a standard lock, so we check the door, frame, and strike and recommend reinforcement where it will make a real difference.",
      "Then we help you choose hardware that fits how you live: a high-security deadbolt, a matching cylinder for other doors, or keys that are restricted so only you can authorize copies. We explain how key control works with the system you choose, install the hardware, and test it with you.",
      "Homeowners across Midland, Odessa, Lubbock, and Amarillo call us when they want stronger locks and better control over who has a key.",
    ],
    stepsHeading: "Upgrading in three steps",
    steps: [
      { title: "Security check", text: "We look at your doors, frames, and current locks." },
      { title: "Choose your hardware", text: "We explain the options and how key control works." },
      { title: "Install and reinforce", text: "New locks fitted, strikes reinforced, everything tested." },
    ],
  },

  "residential/mailbox-locks": {
    intro: [
      "Mailbox keys are small, easy to lose, and easy to forget about until a stack of mail is waiting behind a locked door. Mailbox locks also wear out, get damaged, or need changing when a home or unit changes hands.",
      "We open, rekey, replace, and install mailbox locks for single-family homes, duplexes, apartment communities, and other properties with locking mailboxes.",
    ],
    situationsHeading: "When to call us",
    situations: [
      "You lost your mailbox key or never received one",
      "You moved in and want to make sure the old key no longer works",
      "The lock is broken, rusted, or the key won't turn",
      "A mailbox was damaged or broken into",
      "You're installing a new locking mailbox at your home",
    ],
    approachHeading: "How we handle mailbox locks",
    approach: [
      "For a lockout, we open the compartment, then either rekey the lock or replace it with a new one and give you fresh keys. Replacing a mailbox lock is usually quick, and it means a previous resident's key won't work anymore.",
      "For cluster mailboxes, we work on the individual compartment locks. The postal carrier's master lock and the outgoing mail slot belong to the postal service and are handled by your local post office, not by a locksmith. Some apartment communities and homeowner associations also handle mailbox keys themselves, so it's worth checking with your property manager first.",
      "We also install new locking mailboxes and posts for homes that want more protection against mail theft. A locking mailbox keeps checks, bank statements, and packages out of reach until you collect them, and we can cut spare keys for anyone in your household. We take care of mailbox locks in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Mailbox service in three steps",
    steps: [
      { title: "Tell us the mailbox type", text: "Single box, cluster unit, or a new install." },
      { title: "Open and replace", text: "We open the compartment and rekey or replace the lock." },
      { title: "New keys in hand", text: "You get fresh keys, and the old ones stop working." },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Commercial                                                        */
  /* ---------------------------------------------------------------- */
  "commercial/commercial-lockouts": {
    intro: [
      "When you can't get into your business, the costs add up quickly: staff waiting in the parking lot, customers turned away, deliveries missed. A commercial lockout needs a fast, professional response and a careful approach to doors and hardware that are expensive to replace.",
      "We get business owners and managers back into offices, storefronts, warehouses, storage rooms, and individual offices or file rooms inside a building. Whether it's the front door before opening time or a single locked office in the middle of the day, the goal is the same: get you in without damage and keep the business running.",
    ],
    situationsHeading: "Typical commercial lockouts",
    situations: [
      "Keys lost, left at home, or locked inside the building",
      "A storefront or office door lock that won't turn",
      "Locked interior offices, supply rooms, or file cabinets",
      "A keypad or access lock that stopped working",
      "An employee left with keys and you need in now",
    ],
    approachHeading: "How we open your business",
    approach: [
      "Commercial doors often use heavier hardware than homes: mortise locks, storefront deadbolts, exit devices, and interchangeable-core cylinders. Our technicians are familiar with these and use entry methods that protect the door and lock wherever possible.",
      "Before we open anything, we confirm that you're authorized to access the property, usually with photo ID along with a business license, lease, or confirmation from the owner or property manager. It protects your business from someone else trying the same thing.",
      "Once you're in, we can rekey the lock if keys are missing, make new keys, or repair the hardware that caused the problem, so you're not facing the same lockout tomorrow. We help businesses in Midland, Odessa, Lubbock, and Amarillo get their doors open and their day back on track.",
    ],
    stepsHeading: "Getting your business open",
    steps: [
      { title: "Call us", text: "Tell us the address and what kind of door and lock you have." },
      { title: "Confirm authorization", text: "We verify that you're allowed to access the property." },
      { title: "Open and fix", text: "We get you in and fix or rekey the lock if needed." },
    ],
  },

  "commercial/commercial-locks": {
    intro: [
      "A busy commercial door might open hundreds of times a day. Residential hardware isn't built for that kind of use; it loosens, wears, and fails much sooner. Commercial-grade locks are designed for heavy traffic and give you more control over keys.",
      "We install, repair, and service commercial locks, including mortise locks, heavy-duty cylindrical lever sets, storefront deadbolts, rim and mortise cylinders, and interchangeable-core cylinders that can be rekeyed quickly by swapping the core.",
    ],
    situationsHeading: "What businesses call us for",
    situations: [
      "Replacing worn or failing locks on high-traffic doors",
      "Fitting out a new office, store, or warehouse",
      "Upgrading to lever handles that are easier for everyone to use",
      "Rekeying after a staff change or a lost key",
      "Repairing locks damaged by wear or a break-in",
    ],
    approachHeading: "How we handle commercial hardware",
    approach: [
      "We start by understanding how each door is used: how many people go through it, who needs a key, and whether it's an entrance, an office, or a storage area. That determines the right type and grade of hardware. For most commercial doors, that means locks rated to recognized industry durability standards, not residential models.",
      "We install hardware so it's properly aligned and secured, which matters even more on doors that see constant use. Where you already have good hardware that's misbehaving, we repair and adjust it rather than replacing it. Small problems like a loose lever, a sticking cylinder, or a latch that doesn't catch are worth fixing early, before they turn into a door that won't lock at closing time.",
      "If you're planning several changes, we can coordinate them with a master key system or interchangeable cores so future rekeying is faster. We work with offices, retail stores, restaurants, warehouses, and property managers in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "How we work with businesses",
    steps: [
      { title: "Walk the doors", text: "We look at each door and how it's used." },
      { title: "Recommend hardware", text: "You get options suited to traffic, security, and budget." },
      { title: "Install or repair", text: "We fit, adjust, and test every lock." },
      { title: "Keys sorted", text: "We cut and organize the keys your team needs." },
    ],
  },

  "commercial/door-closers": {
    intro: [
      "A door closer is the arm and cylinder at the top of a door that pulls it shut on its own. When it's working, nobody notices. When it isn't, doors slam hard enough to rattle the glass, drift open in the wind, or close so slowly they never latch, which leaves the building unlocked without anyone realizing.",
      "We adjust, repair, and replace door closers on storefronts, offices, warehouses, apartment buildings, and gates.",
    ],
    situationsHeading: "Signs your closer needs attention",
    situations: [
      "The door slams or closes too fast",
      "The door closes so slowly it doesn't latch",
      "Oil is leaking from the closer body",
      "The door is hard to open, or blows open in the wind",
      "The arm is bent, loose, or disconnected",
    ],
    approachHeading: "How we fix door closers",
    approach: [
      "Many closer problems can be fixed with an adjustment. Most closers have separate valves that control how fast the door swings and how firmly it pulls shut in the last few inches, and some also control how hard the door is to open. We set these so the door closes smoothly and latches every time, without slamming.",
      "A closer that's leaking oil has usually lost its seals and can't be adjusted back into working order, so it needs replacing. We'll fit a new closer sized for the door's weight and width, and choose the right mounting for your door and frame. We also check the hinges and latch, because a closer can't do its job if the door itself is sagging or binding.",
      "Doors that are meant to close and latch on their own, such as many fire-rated and exterior doors, depend on a working closer. We adjust and install closers for businesses and properties in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Closer service in three steps",
    steps: [
      { title: "Inspect", text: "We check the closer, arm, hinges, and latch." },
      { title: "Adjust or replace", text: "We tune what can be tuned and replace what's worn out." },
      { title: "Test the swing", text: "The door closes smoothly and latches every time." },
    ],
  },

  "commercial/master-key-systems": {
    intro: [
      "As a business grows, so does the key ring. Before long, managers carry a dozen keys, nobody is sure which key opens which door, and replacing a lost key means rekeying half the building. A master key system brings order to that.",
      "In a master key system, each lock is set up so that its own key opens it, and a master key opens it too. You decide who gets what: staff keys open only their areas, a manager key opens a department, and a master key opens everything.",
    ],
    situationsHeading: "When a master key system helps",
    situations: [
      "Managers carrying too many keys",
      "Offices, suites, or storage areas that need different levels of access",
      "Apartment buildings and multi-tenant properties",
      "Businesses with frequent staff turnover",
      "Planning for expansion so new doors fit the existing system",
    ],
    approachHeading: "How we design your system",
    approach: [
      "We start with a list of doors and people, then map out who needs access to what. From that, we design a key plan, sometimes with several levels: a grand master, master keys for departments or floors, and individual change keys for each door.",
      "We rekey or replace the cylinders to match the plan, cut and label the keys, and give you a clear record of which key opens which locks. Key control is part of the design: restricted keyways can keep keys from being copied without authorization, so the system stays the way you set it up.",
      "As your business changes, the system can grow with it. New doors can be added, and a lost key can often be handled by rekeying only the affected locks. We set up master key systems for businesses and property managers in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Building a master key system",
    steps: [
      { title: "Map your doors", text: "We list every door and who needs access to it." },
      { title: "Design the key plan", text: "We set up levels of access that match how you work." },
      { title: "Rekey and cut", text: "Cylinders are pinned to the plan and keys are cut and labeled." },
      { title: "Keep records", text: "You get a clear record so the system stays organized." },
    ],
  },

  "commercial/high-security-locks": {
    intro: [
      "Some areas of a business need more protection than a standard lock gives: the stockroom, the server closet, the cash office, the pharmacy cabinet, the room where records are kept. High-security cylinders and restricted keys are designed for exactly those doors.",
      "They resist picking, bumping, and drilling far better than standard cylinders. More importantly for many businesses, they offer key control: keys that can't be copied at a hardware store, so you know exactly how many exist and who has them.",
    ],
    situationsHeading: "Where businesses use high-security locks",
    situations: [
      "Stockrooms and areas holding valuable inventory",
      "Server rooms, network closets, and record rooms",
      "Cash offices, safes, and pharmacy or medication storage",
      "Main entrances after a break-in or a lost master key",
      "Businesses that need a record of who holds which keys",
    ],
    approachHeading: "How we secure sensitive areas",
    approach: [
      "We look at which doors need the most protection and how they're used, then recommend high-security cylinders that fit your existing hardware where possible, which can keep costs down. For doors that need it, we also check the frame, strike, and hinges, since a strong lock is only as good as the door around it.",
      "Key control is set up from the start. Keys are restricted, copies are only made with authorization from the people you designate, and you keep a record of every key issued. High-security cylinders can also be included in a master key system, so managers don't need a separate key for every protected door.",
      "If a key goes missing, restricted keys make it easier to decide what needs rekeying, because you know exactly which doors that key opened. We install and service high-security locks for businesses in Midland, Odessa, Lubbock, and Amarillo, from a single stockroom door to every entrance in a building.",
    ],
    stepsHeading: "Securing your business",
    steps: [
      { title: "Identify key doors", text: "We find the areas that need the most protection." },
      { title: "Plan key control", text: "You decide who can authorize copies, and we keep it that way." },
      { title: "Install and test", text: "High-security cylinders fitted and tested on each door." },
    ],
  },

  "commercial/panic-bars-door-alarms": {
    intro: [
      "Panic bars, also called exit devices or push bars, let people leave a building quickly by pushing a bar across the door, even in a crowd or in the dark. From outside, the door stays locked. Many commercial buildings are required to have them on certain exit doors.",
      "Standalone door alarms add another layer. They sound locally when a door is opened, so you know right away if a rear exit or emergency door is being used when it shouldn't be.",
    ],
    situationsHeading: "Why businesses call us",
    situations: [
      "Installing exit devices on new or remodeled doors",
      "Panic bars that stick, don't latch, or are hard to push",
      "Back doors used as shortcuts or for unauthorized exits",
      "Adding outside key or lever access to an exit door",
      "Replacing worn or damaged exit hardware",
    ],
    approachHeading: "How we install and service exit hardware",
    approach: [
      "We install rim, surface vertical rod, and mortise exit devices, matched to the door type, the frame, and how the door is used. Where staff need to come in through an exit door, we can add an outside trim with a key or lever. For daytime use, many devices can be dogged, which holds the latch back so the door can simply be pushed or pulled open.",
      "Exit devices on doors that are part of a required exit path must meet building and fire codes, and local fire officials have the final say on what's required. We install and repair exit hardware so it works as intended, and we're happy to work with your contractor or inspector.",
      "For doors that shouldn't be opened casually, we install battery-powered standalone alarms or exit devices with built-in alarms that sound at the door. We service exit hardware and door alarms for businesses in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "How it works",
    steps: [
      { title: "Look at the door", text: "We check the door, frame, and how the exit is used." },
      { title: "Choose the device", text: "Exit device, outside access, alarm, or a combination." },
      { title: "Install and test", text: "We fit the hardware and test it from both sides." },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Automotive                                                        */
  /* ---------------------------------------------------------------- */
  "automotive/car-lockout": {
    intro: [
      "Locking your keys in the car happens to everyone eventually: at the gas pump, in a grocery store parking lot, at a job site, or in your own driveway. Modern vehicles can lock themselves when a door shuts, and some keys can end up locked in the trunk.",
      "Our car lockout service gets you back into your car, pickup, SUV, or van with professional tools designed to protect your paint, weather seals, and door locks.",
    ],
    situationsHeading: "Common car lockouts",
    situations: [
      "Keys locked in the cab or the ignition",
      "Keys locked in the trunk",
      "A vehicle that locked itself with the key fob inside",
      "A key broken off in the door lock",
      "A fob with a dead battery and no obvious way in",
    ],
    approachHeading: "How we open your vehicle",
    approach: [
      "If a child or a pet is locked inside, especially in the West Texas heat, call 911 first. Temperatures inside a closed car climb dangerously fast, and emergency responders can get in immediately.",
      "For every other lockout, tell us the year, make, and model of your vehicle and where it's parked. Our technician uses professional entry tools, such as long-reach tools and air wedges, to open the door without scratching paint or tearing seals. Improvised tools like coat hangers can damage the wiring and side-airbag parts inside a modern door.",
      "Before opening the vehicle, we confirm that it's yours or that you're authorized to access it, usually with photo ID and the registration or title (once the door is open, if the paperwork is inside). If your key is lost rather than locked inside, we can cut and program a replacement on the spot for many vehicles. We handle car lockouts across Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Back in your car",
    steps: [
      { title: "Call with your vehicle", text: "Year, make, model, and where it's parked." },
      { title: "Careful entry", text: "We open it with tools that protect paint and seals." },
      { title: "Confirm ownership", text: "We check your ID and registration before you drive off." },
    ],
  },

  "automotive/duplicate-car-keys": {
    intro: [
      "Most people don't think about a spare car key until the only one is lost, and replacing a key with nothing to copy from is more involved than making a duplicate. If you have a working key today, now is the best time to get a spare.",
      "We copy and program spare keys for many vehicles, including transponder keys, remote-head keys, flip keys, and many smart and proximity fobs.",
    ],
    situationsHeading: "Good reasons to get a spare",
    situations: [
      "You bought a used vehicle that came with only one key",
      "A second driver in the household needs their own key",
      "Your only key is worn, cracked, or has a failing remote",
      "You want a basic spare for emergencies or a valet",
      "A work truck is shared between employees",
    ],
    approachHeading: "How we make your spare",
    approach: [
      "Many vehicles made since the late 1990s use transponder keys, which have a small chip in the head that the vehicle must recognize before the engine will start. A spare cut to the right shape will open the doors, but it won't start the vehicle until its chip or fob is programmed to your car. We cut the blade and handle the programming.",
      "When you call, give us the year, make, and model and tell us what kind of key you have now. That lets us confirm what your vehicle needs and bring the right key or fob. Programming requirements vary between makes and models, and some vehicles need the existing key present, so having it with you helps.",
      "We'll test the new key in the doors and ignition, and test the remote functions, before we leave. We make spare car keys for drivers in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Getting a spare key",
    steps: [
      { title: "Tell us your vehicle", text: "Year, make, model, and the key type you have now." },
      { title: "Cut the blade", text: "We cut the new key to match your existing one." },
      { title: "Program and test", text: "We program the chip or fob and test every function." },
    ],
  },

  "automotive/car-locksmith": {
    intro: [
      "Vehicle lock and key problems come in all shapes. One day it's a key snapped off in the door, the next it's a fob that won't unlock anything, or a trunk that refuses to open. Our car locksmith service covers the full range, and we come to wherever your vehicle is parked.",
      "Because we bring our tools and programming equipment with us, many vehicle problems can be fixed on the spot without a tow.",
    ],
    situationsHeading: "Problems we handle",
    situations: [
      "A key broken off in the door, trunk, or ignition",
      "A key fob that stopped working or won't sync",
      "Door or trunk locks that are stuck, worn, or damaged",
      "Worn keys that barely turn",
      "Replacing a cracked fob shell or a broken key head",
    ],
    approachHeading: "How we work on your vehicle",
    approach: [
      "Broken keys are a common call. We extract the broken piece from the lock with specialized tools, and then cut a new key, often using the broken pieces as a guide. If the key had a transponder chip, we can program the replacement.",
      "For fob problems, we start with the simple things: the battery, the buttons, and the shell. Sometimes the fix is a fresh battery or a new shell for your existing electronics. If the fob itself has failed or lost its programming, we can program a replacement for many vehicles.",
      "Worn or damaged door and trunk locks can often be repaired or rekeyed to match your existing key, so you don't need to carry a second key. If a problem is outside what a locksmith can fix, such as an electrical fault, we'll tell you. We provide car locksmith service in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "How it works",
    steps: [
      { title: "Describe the problem", text: "Tell us your vehicle and what's going on." },
      { title: "Diagnose on site", text: "We find out whether it's the key, the fob, or the lock." },
      { title: "Fix it there", text: "Most repairs are done right where your vehicle is parked." },
    ],
  },

  "automotive/ignition-repair-replacement": {
    intro: [
      "The ignition cylinder takes a beating. Every start, every heavy key ring swinging from it, and every year of West Texas dust wears its pins and springs a little more. Eventually the key gets hard to turn, sticks in place, or won't go in at all.",
      "We repair and replace ignition cylinders for many cars, pickups, and SUVs, and match the new cylinder to your existing keys whenever possible, so you don't have to carry two.",
    ],
    situationsHeading: "Signs of an ignition problem",
    situations: [
      "The key won't turn, or only turns after jiggling",
      "The key won't go in, or gets stuck and won't come out",
      "The ignition feels loose or turns without resistance",
      "A key broke off inside the ignition",
      "The ignition was damaged in a theft attempt",
    ],
    approachHeading: "How we handle ignition repairs",
    approach: [
      "First, a quick check: if the steering wheel is locked, turn it gently left and right while turning the key. That releases the steering lock and solves many \"stuck ignition\" calls on the spot.",
      "If that doesn't do it, we check whether the problem is the key or the cylinder. A badly worn key can feel just like a failing ignition, and cutting a fresh key may be all it takes. When the cylinder itself is worn or damaged, we repair it where possible or replace it with a new cylinder keyed to your existing key.",
      "Many vehicles have a transponder system tied to the key, so we make sure your keys still start the engine after any ignition work. And if the real problem turns out to be electrical, like a starter or battery, we'll tell you so you can take it to the right place. We repair ignitions in Midland, Odessa, Lubbock, and Amarillo.",
    ],
    stepsHeading: "Fixing your ignition",
    steps: [
      { title: "Describe the symptoms", text: "Tell us your vehicle and what the key is doing." },
      { title: "Key or cylinder?", text: "We find out whether the key or the ignition is worn." },
      { title: "Repair or replace", text: "We fix the cylinder or fit a new one keyed to your key." },
      { title: "Test the start", text: "We make sure your key turns and starts the vehicle." },
    ],
  },
};

export function getServiceDetail(category: string, slug: string): ServiceDetail | undefined {
  return serviceDetails[`${category}/${slug}`];
}
