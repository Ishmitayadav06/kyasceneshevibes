// ---------------------------------------------------------------------------
// CampusClarity mock data layer
// Everything a real backend would provide lives here so the UI can be wired
// to an API later by swapping these exports for fetches.
// ---------------------------------------------------------------------------

export type Category = "Academic" | "Societies" | "Hostels" | "Events"
export type Priority = "Urgent" | "High" | "Normal"

// Deadlines are anchored to a FIXED reference instant rather than Date.now().
// This module is evaluated separately on the server and on the client, so a
// live clock would produce different ISO strings in each environment — the
// resulting attribute mismatch (e.g. calendar links) makes React discard and
// regenerate the hydrated tree, wiping interactive component state on load.
const now = new Date("2026-09-13T09:00:00.000Z").getTime()
const hours = (h: number) => new Date(now + h * 60 * 60 * 1000).toISOString()
const days = (d: number) => new Date(now + d * 24 * 60 * 60 * 1000).toISOString()

// --- User profile ----------------------------------------------------------

export type UserProfile = {
  name: string
  year: string
  course: string
  interests: string[]
}

export const userProfile: UserProfile = {
  name: "Ishmita",
  year: "1st Year",
  course: "Computer Science",
  interests: ["Competitive Programming", "AI/ML", "Design"],
}

// --- Smart feed -------------------------------------------------------------

export type FeedItem = {
  id: string
  title: string
  category: Category
  priority: Priority
  summary: string
  source: string
  /** ISO timestamp of the deadline, or null when there's no hard deadline */
  deadline: string | null
  /** External destination for "link" actions — where "Open Link" should navigate. */
  action: { label: string; type: "calendar" | "link"; url?: string }
}

export const feedItems: FeedItem[] = [
  {
    id: "1",
    title: "Data Structures Assignment 3 due",
    category: "Academic",
    priority: "Urgent",
    summary:
      "Submit Assignment 3 on linked lists and trees through the CS portal before the cutoff. Late submissions lose 10% per hour with no exceptions this week.",
    source: "CS Dept WhatsApp",
    deadline: hours(6),
    action: { label: "Add to Calendar", type: "calendar" },
  },
  {
    id: "2",
    title: "Scholarship form final call",
    category: "Academic",
    priority: "Urgent",
    summary:
      "The merit-cum-means scholarship form must be uploaded with your income certificate today. The finance office will not reopen the portal after midnight.",
    source: "Finance Office Email",
    deadline: hours(14),
    action: { label: "Open Link", type: "link", url: "https://scholarships.gov.in" },
  },
  {
    id: "3",
    title: "Calculus II mid-term venue changed",
    category: "Academic",
    priority: "High",
    summary:
      "Tomorrow's mid-term has moved from Hall B to the Central Examination Block, Room 204. Carry your ID card and reach 15 minutes early for verification.",
    source: "Exam Cell Notice",
    deadline: days(1),
    action: { label: "Add to Calendar", type: "calendar" },
  },
  {
    id: "4",
    title: "Coding Club — build night",
    category: "Societies",
    priority: "Normal",
    summary:
      "The coding club meets Friday at 6 PM in the Innovation Lab (2nd floor, Library Annex) for a hackathon warm-up. Bring your laptop and a project idea to pitch.",
    source: "Coding Club Instagram",
    deadline: days(3),
    action: { label: "Add to Calendar", type: "calendar" },
  },
  {
    id: "5",
    title: "Hostel mess menu feedback",
    category: "Hostels",
    priority: "Normal",
    summary:
      "The hostel committee wants your vote on next month's mess menu through a quick form. Responses submitted this week directly shape the weekend specials.",
    source: "Hostel Warden Notice",
    deadline: days(5),
    action: { label: "Open Link", type: "link", url: "https://docs.google.com/forms" },
  },
  {
    id: "6",
    title: "Guest lecture: Systems at Scale",
    category: "Events",
    priority: "High",
    summary:
      "A senior engineer from a top product company will talk about designing systems for millions of users on Thursday afternoon. Attendance earns one seminar credit.",
    source: "CS Dept Notice Board",
    deadline: days(2),
    action: { label: "Open Link", type: "link", url: "https://www.acm.org/conferences" },
  },
  {
    id: "7",
    title: "Photography society photowalk",
    category: "Societies",
    priority: "Normal",
    summary:
      "Join the photography society for a campus-to-lakeside photowalk this Sunday morning. Beginners are welcome and a few DSLRs will be available to borrow.",
    source: "Photography Society WhatsApp",
    deadline: days(6),
    action: { label: "Add to Calendar", type: "calendar" },
  },
  {
    id: "8",
    title: "Hostel water supply maintenance",
    category: "Hostels",
    priority: "Normal",
    summary:
      "Water supply to Blocks C and D will pause on Saturday from 10 AM to 2 PM for tank cleaning. Store enough water in advance to avoid inconvenience.",
    source: "Estate Office Notice",
    deadline: null,
    action: { label: "Open Link", type: "link", url: "https://www.igdtuw.ac.in" },
  },
  {
    id: "9",
    title: "AI Workshop registration open",
    category: "Events",
    priority: "High",
    summary:
      "Microsoft Student Chapter opens sign-ups for a hands-on AI workshop covering prompt design and building a small model. Seats are limited to 60 students.",
    source: "MSC Announcement",
    deadline: days(4),
    action: { label: "Add to Calendar", type: "calendar" },
  },
]

export const filters = ["All", "Urgent", "Academic", "Societies", "Hostels", "Events"] as const
export type Filter = (typeof filters)[number]

/** Sort by soonest deadline; items without a deadline sink to the bottom. */
export function sortByDeadline<T extends { deadline: string | null }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })
}

export function filterFeed(items: FeedItem[], filter: Filter): FeedItem[] {
  if (filter === "All") return items
  if (filter === "Urgent") return items.filter((i) => i.priority === "Urgent")
  return items.filter((i) => i.category === filter)
}

export const categoryStyles: Record<Category, string> = {
  Academic:
    "bg-violet-500/10 text-violet-600 ring-1 ring-inset ring-violet-500/20 dark:text-violet-300",
  Societies:
    "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-300",
  Hostels:
    "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",
  Events:
    "bg-sky-500/10 text-sky-600 ring-1 ring-inset ring-sky-500/20 dark:text-sky-300",
}

export const priorityStyles: Record<Priority, string> = {
  Urgent: "bg-rose-500/15 text-rose-600 ring-1 ring-inset ring-rose-500/25 dark:text-rose-300",
  High: "bg-amber-500/15 text-amber-600 ring-1 ring-inset ring-amber-500/25 dark:text-amber-300",
  Normal: "bg-muted text-muted-foreground",
}

// --- Daily briefing ---------------------------------------------------------

export function briefingStats() {
  const urgent = feedItems.filter((i) => i.priority === "Urgent").length
  const scheduleChanges = feedItems.filter((i) => i.title.toLowerCase().includes("changed")).length
  const upcomingEvents = feedItems.filter((i) => i.category === "Events" || i.category === "Societies").length
  return { urgent, scheduleChanges, upcomingEvents }
}

// --- Tasks & deadline load --------------------------------------------------

/** Feed items that represent actionable to-dos — the ones with a hard deadline. */
export const taskItems: FeedItem[] = feedItems.filter((i) => i.deadline)

/** IDs of tasks whose deadline lands within the next 24 hours ("today"). */
export function dueTodayTaskIds(): string[] {
  const cutoff = Date.now() + 24 * 60 * 60 * 1000
  return taskItems.filter((i) => new Date(i.deadline as string).getTime() <= cutoff).map((i) => i.id)
}

// --- Weekly overview --------------------------------------------------------

export type WeeklyStat = {
  key: string
  label: string
  value: number
  tone: "primary" | "sky" | "amber" | "rose"
  /** Where clicking the stat should take the user. */
  view: NavView
}

export const weeklyStats: WeeklyStat[] = [
  { key: "assignments", label: "Assignments", value: 4, tone: "primary", view: "feed" },
  { key: "events", label: "Events", value: 6, tone: "sky", view: "events" },
  { key: "classes", label: "Timetable", value: 18, tone: "amber", view: "timetable" },
  { key: "urgent", label: "Urgent", value: 2, tone: "rose", view: "feed" },
]

export const weeklyProgress = 80 // percent on track

// --- Calendar ---------------------------------------------------------------

export type EventCategory = Category | "Personal"

export type CalendarEvent = {
  id: string
  title: string
  /** ISO timestamp */
  date: string
  category: EventCategory
  priority?: Priority
  description?: string
}

/** Convert a single feed item into a calendar event (falls back to now when it has no deadline). */
export function feedItemToCalendarEvent(item: FeedItem): CalendarEvent {
  return {
    id: `feed-${item.id}`,
    title: item.title,
    date: item.deadline ?? new Date().toISOString(),
    category: item.category,
    priority: item.priority,
    description: item.summary,
  }
}

/** Calendar events derived from feed items that carry a hard deadline. */
export function feedCalendarEvents(): CalendarEvent[] {
  return feedItems.filter((a) => a.deadline).map(feedItemToCalendarEvent)
}

export const eventDotColors: Record<EventCategory, string> = {
  Academic: "bg-violet-500",
  Societies: "bg-amber-500",
  Hostels: "bg-emerald-500",
  Events: "bg-sky-500",
  Personal: "bg-fuchsia-500",
}

export const eventCategories: EventCategory[] = [
  "Personal",
  "Academic",
  "Societies",
  "Hostels",
  "Events",
]

export type CalendarBucket = "Today" | "Tomorrow" | "This Week" | "Upcoming"

export function bucketFor(dateISO: string): CalendarBucket {
  const d = new Date(dateISO)
  const today = new Date()
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const dayDiff = Math.round((startOfDay(d) - startOfDay(today)) / (24 * 60 * 60 * 1000))
  if (dayDiff <= 0) return "Today"
  if (dayDiff === 1) return "Tomorrow"
  if (dayDiff <= 7) return "This Week"
  return "Upcoming"
}

// --- Campus events & societies ---------------------------------------------

export type CampusEventCategory =
  | "Technical"
  | "Cultural"
  | "Sports"
  | "Workshops"
  | "Hackathons"
  | "Societies"

export type CampusEvent = {
  id: string
  name: string
  society: string
  category: CampusEventCategory
  date: string
  time: string
  location: string
  description: string
  registered: boolean
  /** Optional organiser/host name for student-added events. */
  host?: string
  /** Optional targeted audience for student-added events. */
  audience?: string
}

export const campusEvents: CampusEvent[] = [
  {
    id: "e1",
    name: "AI Workshop",
    society: "Microsoft Student Chapter",
    category: "Workshops",
    date: "September 18",
    time: "4:00 PM",
    location: "Seminar Hall",
    description:
      "A hands-on session on prompt design and shipping a small model. Bring a laptop; no prior ML experience needed.",
    registered: false,
  },
  {
    id: "e2",
    name: "ICPC Training Session",
    society: "Competitive Programming Club",
    category: "Technical",
    date: "September 20",
    time: "6:00 PM",
    location: "Innovation Lab",
    description:
      "Weekly practice contest with editorial walkthroughs on graphs and dynamic programming. Open to all skill levels.",
    registered: true,
  },
  {
    id: "e3",
    name: "Hackathon 2027",
    society: "Coding Club",
    category: "Hackathons",
    date: "October 4",
    time: "9:00 AM",
    location: "Central Auditorium",
    description:
      "A 24-hour build sprint with mentors, snacks, and prizes. Form teams of up to four and ship something real.",
    registered: false,
  },
  {
    id: "e4",
    name: "Cultural Night",
    society: "Fine Arts Society",
    category: "Cultural",
    date: "September 25",
    time: "7:00 PM",
    location: "Open Air Theatre",
    description:
      "An evening of music, dance, and drama performances from student groups across every department.",
    registered: false,
  },
  {
    id: "e5",
    name: "Inter-Hostel Football Cup",
    society: "Sports Committee",
    category: "Sports",
    date: "September 22",
    time: "5:00 PM",
    location: "Main Ground",
    description:
      "The knockout rounds of the inter-hostel football tournament. Come support your block or sign up as a reserve.",
    registered: false,
  },
  {
    id: "e6",
    name: "Photography Photowalk",
    society: "Photography Society",
    category: "Societies",
    date: "September 21",
    time: "6:30 AM",
    location: "Campus Lake",
    description:
      "A sunrise photowalk from campus to the lakeside. Beginners welcome; a few DSLRs available to borrow.",
    registered: true,
  },
]

export const campusEventCategories: CampusEventCategory[] = [
  "Technical",
  "Cultural",
  "Sports",
  "Workshops",
  "Hackathons",
  "Societies",
]

export type Society = {
  id: string
  name: string
  category: CampusEventCategory
  members: number
  description: string
  tags: string[]
  about: string
  website: string
  /** Optional display label for the website link; falls back to the URL host. */
  websiteLabel?: string
  founded: number
  meets: string
  highlights: string[]
}

export const societies: Society[] = [
  {
    id: "s0",
    name: "AssetMerkle",
    category: "Technical",
    members: 260,
    description: "North India's only student-led Web3 and Blockchain society — building the dApps and builders of tomorrow.",
    tags: ["Blockchain", "Web3", "dApps"],
    about:
      "We are AssetMerkle, the premier student-led Web3 and Blockchain community of IGDTUW. We design next-gen dApps, launch national hackathons, and shape the builders of tomorrow. As North India's only society dedicated to blockchain and Web3, we bring together developers, researchers, and creators to explore decentralized technology hands-on.",
    website: "https://assetmerkle.vercel.app",
    websiteLabel: "AssetMerkle | Official Blockchain & Web3 Community of IGDTUW",
    founded: 2022,
    meets: "Saturdays, 3:00 PM · Innovation Lab, IGDTUW",
    highlights: [
      "North India's only Web3 & Blockchain society",
      "National-level blockchain hackathons",
      "Next-gen dApp design & development",
    ],
  },
  {
    id: "s1",
    name: "Coding Club",
    category: "Technical",
    members: 420,
    description: "Build nights, hackathons, and open-source sprints for students who love to ship.",
    tags: ["Web", "Open Source", "Hackathons"],
    about:
      "The Coding Club is the campus home for builders. From late-night hack sessions to open-source sprints, we turn ideas into shipped projects. Members collaborate on real products, mentor juniors, and represent the college at national hackathons.",
    website: "https://codingclub.dev",
    founded: 2014,
    meets: "Thursdays, 6:00 PM · Lab 3, CS Block",
    highlights: ["48-hour flagship hackathon", "Weekly build nights", "Open-source mentorship program"],
  },
  {
    id: "s2",
    name: "Microsoft Student Chapter",
    category: "Workshops",
    members: 310,
    description: "Workshops and certifications on cloud, AI, and modern developer tooling.",
    tags: ["AI/ML", "Cloud", "Workshops"],
    about:
      "The Microsoft Student Chapter connects students with the Microsoft ecosystem through hands-on workshops, certification bootcamps, and speaker sessions on Azure, AI, and developer productivity tools.",
    website: "https://mlsa.microsoft.com",
    founded: 2016,
    meets: "Saturdays, 11:00 AM · Seminar Hall B",
    highlights: ["Azure certification bootcamps", "Cloud & AI workshops", "Industry speaker sessions"],
  },
  {
    id: "s3",
    name: "Competitive Programming Club",
    category: "Technical",
    members: 180,
    description: "Weekly contests, ICPC training, and editorial sessions on algorithms.",
    tags: ["DSA", "ICPC", "Contests"],
    about:
      "The Competitive Programming Club sharpens problem-solving skills through weekly rated contests, ICPC-style training camps, and detailed editorial walkthroughs covering data structures and algorithms.",
    website: "https://cpclub.io",
    founded: 2015,
    meets: "Sundays, 4:00 PM · Online + Lab 1",
    highlights: ["Weekly rated contests", "ICPC training camp", "Editorial & upsolving sessions"],
  },
  {
    id: "s4",
    name: "Fine Arts Society",
    category: "Cultural",
    members: 260,
    description: "Music, dance, theatre, and the campus cultural fest every semester.",
    tags: ["Music", "Dance", "Theatre"],
    about:
      "The Fine Arts Society is the beating heart of campus culture, bringing together musicians, dancers, and theatre artists. We host the flagship cultural fest each semester and stage regular open-mic and performance nights.",
    website: "https://finearts.college.edu",
    founded: 2009,
    meets: "Wednesdays, 5:30 PM · Auditorium Annexe",
    highlights: ["Semester cultural fest", "Open-mic nights", "Theatre & dance productions"],
  },
  {
    id: "s5",
    name: "Photography Society",
    category: "Societies",
    members: 150,
    description: "Photowalks, editing workshops, and campus event coverage.",
    tags: ["Photography", "Editing"],
    about:
      "The Photography Society captures campus life one frame at a time. Members join guided photowalks, learn post-processing in editing workshops, and form the official media team covering major college events.",
    website: "https://photosoc.college.edu",
    founded: 2013,
    meets: "Fridays, 4:30 PM · Media Room",
    highlights: ["Guided photowalks", "Lightroom & editing workshops", "Official event coverage team"],
  },
  {
    id: "s6",
    name: "Sports Committee",
    category: "Sports",
    members: 500,
    description: "Inter-hostel tournaments, fitness meetups, and the annual sports fest.",
    tags: ["Football", "Cricket", "Athletics"],
    about:
      "The Sports Committee keeps campus active, organizing inter-hostel tournaments, morning fitness meetups, and the much-loved annual sports fest across football, cricket, and athletics.",
    website: "https://sports.college.edu",
    founded: 2008,
    meets: "Daily, 6:30 AM · Main Ground",
    highlights: ["Inter-hostel tournaments", "Annual sports fest", "Fitness & training meetups"],
  },
]

// --- Recommendations --------------------------------------------------------

export type Recommendation = {
  id: string
  title: string
  reason: string
  cta: string
}

export const recommendations: Recommendation[] = [
  {
    id: "r1",
    title: "ICPC Training Session",
    reason: "Because you're interested in competitive programming.",
    cta: "View session",
  },
  {
    id: "r2",
    title: "AI Workshop",
    reason: "Recommended for students interested in AI/ML.",
    cta: "Reserve seat",
  },
  {
    id: "r3",
    title: "Hackathon 2027",
    reason: "Registration opens soon — build with a team.",
    cta: "Get notified",
  },
]

// --- Notifications ----------------------------------------------------------

export type NotificationCategory = "Urgent" | "Academic" | "Societies" | "Events"

export type CampusNotification = {
  id: string
  category: NotificationCategory
  title: string
  detail: string
  time: string
  read: boolean
}

export const notifications: CampusNotification[] = [
  {
    id: "n1",
    category: "Urgent",
    title: "Assignment deadline approaching",
    detail: "Data Structures Assignment 3 is due in about 6 hours.",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    category: "Academic",
    title: "Schedule change",
    detail: "Calculus II mid-term moved to Central Exam Block, Room 204.",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    category: "Societies",
    title: "Coding Club build night",
    detail: "Friday 6 PM at the Innovation Lab. Bring a project idea.",
    time: "3h ago",
    read: false,
  },
  {
    id: "n4",
    category: "Events",
    title: "AI Workshop seats filling up",
    detail: "Microsoft Student Chapter workshop is 70% full.",
    time: "5h ago",
    read: true,
  },
]

// --- Global search ----------------------------------------------------------

export type SearchResult = {
  id: string
  title: string
  subtitle: string
  category: string
  priority?: Priority
  view: NavView
}

export function searchCampus(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []

  for (const item of feedItems) {
    if (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `feed-${item.id}`,
        title: item.title,
        subtitle: item.deadline
          ? `${item.category} • ${new Date(item.deadline).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}`
          : item.category,
        category: item.category,
        priority: item.priority,
        view: "feed",
      })
    }
  }

  for (const e of campusEvents) {
    if (
      e.name.toLowerCase().includes(q) ||
      e.society.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `event-${e.id}`,
        title: e.name,
        subtitle: `${e.society} • ${e.date}`,
        category: e.category,
        view: "events",
      })
    }
  }

  for (const s of societies) {
    if (s.name.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q))) {
      results.push({
        id: `society-${s.id}`,
        title: s.name,
        subtitle: `Society • ${s.members} members`,
        category: s.category,
        view: "societies",
      })
    }
  }

  return results.slice(0, 8)
}

// --- AI announcement summarizer (mock) --------------------------------------

export type SummaryResult = {
  important: string
  deadline: string
  action: string
  category: string
  priority: Priority
  source: string
}

/** A deterministic mock "AI" that extracts structure from pasted text. */
export function summarizeAnnouncement(text: string): SummaryResult {
  const lower = text.toLowerCase()

  const isAcademic = /assignment|exam|quiz|lab|submission|portal|lecture|class/.test(lower)
  const isSociety = /club|society|chapter|fest|workshop|meet/.test(lower)
  const isHostel = /hostel|mess|warden|block|water|room/.test(lower)

  const category = isAcademic ? "Academic" : isSociety ? "Societies" : isHostel ? "Hostels" : "Events"

  const urgent = /today|tonight|midnight|urgent|immediately|last date|final call|deadline|due/.test(lower)
  const priority: Priority = urgent ? "Urgent" : /tomorrow|soon|this week/.test(lower) ? "High" : "Normal"

  // Try to pull a date-like phrase.
  const dateMatch =
    text.match(
      /\b(\d{1,2}\s*(?:st|nd|rd|th)?\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\b/i,
    ) ||
    text.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{1,2}\b/i) ||
    text.match(/\b(today|tomorrow|tonight|this week|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i)

  const timeMatch = text.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i) || text.match(/\b(\d{1,2}:\d{2})\b/)

  const deadline =
    dateMatch || timeMatch
      ? [dateMatch?.[0], timeMatch?.[0]].filter(Boolean).join(", ")
      : "No hard deadline detected"

  // First sentence as the headline / important bit.
  const firstSentence = text.trim().split(/[.\n!?]/)[0]?.trim() || "Announcement"
  const important =
    firstSentence.length > 80 ? firstSentence.slice(0, 77).trimEnd() + "…" : firstSentence || "Announcement"

  const action = isAcademic
    ? "Complete and submit through the relevant portal before the deadline."
    : isSociety
      ? "Register or RSVP to reserve your spot at the event."
      : isHostel
        ? "Note the change and plan around it to avoid inconvenience."
        : "Review the details and add the event to your calendar."

  const sourceMatch = text.match(/(?:from|source|-)\s*([A-Z][A-Za-z ]{2,30}(?:Dept|Department|Office|Cell|Club|Society|Committee|Chapter))/)
  const source = sourceMatch?.[1]?.trim() || (isAcademic ? "Academic Dept" : isHostel ? "Hostel Office" : "Campus Notice")

  return { important, deadline, action, category, priority, source }
}

// --- AI assistant (mock) ----------------------------------------------------

export type ChatReply = { match: string[]; answer: string }

export const assistantSuggestions = [
  "What should I prioritize today?",
  "What do I have tomorrow?",
  "What assignments are due this week?",
  "Show me upcoming society events.",
]

export const chatReplies: ChatReply[] = [
  {
    match: ["prioritize", "priority", "urgent", "important", "today", "first"],
    answer:
      "Start with your 2 urgent items: Data Structures Assignment 3 (due in ~6 hours) and the scholarship form (closes at midnight). After those, glance at the Calculus II mid-term venue change for tomorrow.",
  },
  {
    match: ["tomorrow"],
    answer:
      "Tomorrow your Calculus II mid-term is at 9 AM — note it moved to the Central Examination Block, Room 204. Reach 15 minutes early with your ID card.",
  },
  {
    match: ["this week", "assignments due", "due this week", "assignment"],
    answer:
      "This week you have Data Structures Assignment 3 (due in ~6 hours) and the scholarship form (tonight). The Coding Club build night is Friday, and the AI Workshop registration closes in a few days.",
  },
  {
    match: ["society", "societies", "event", "events", "workshop", "club"],
    answer:
      "Upcoming society events: Coding Club build night (Fri 6 PM, Innovation Lab), AI Workshop by Microsoft Student Chapter (Sep 18), and the Photography photowalk (Sun morning). Want me to add any to your calendar?",
  },
  {
    match: ["holiday", "break", "next holiday"],
    answer:
      "There's no official holiday on your feed this week. The next long weekend lines up with the cultural fest at the end of the month — I'll flag it when the calendar confirms.",
  },
  {
    match: ["scholarship", "form", "finance"],
    answer:
      "The merit-cum-means scholarship form closes tonight at midnight. Upload it with your income certificate through the Finance Office portal — it won't reopen after the cutoff.",
  },
  {
    match: ["hostel", "mess", "food", "water"],
    answer:
      "Hostel updates: mess menu feedback is open this week, and water supply in Blocks C & D pauses Saturday 10 AM–2 PM for tank cleaning. Store water in advance.",
  },
]

export function getChatReply(question: string): string {
  const q = question.toLowerCase()
  for (const reply of chatReplies) {
    if (reply.match.some((m) => q.includes(m))) return reply.answer
  }
  return "I couldn't find anything specific on that yet. Try asking what to prioritize today, what's due this week, or about upcoming society events — I keep an eye on every campus channel for you."
}

// --- Navigation -------------------------------------------------------------

export type NavView =
  | "dashboard"
  | "feed"
  | "calendar"
  | "timetable"
  | "events"
  | "societies"
  | "summarizer"

// --- Timetable --------------------------------------------------------------

export type ClassType = "Lecture" | "Lab" | "Tutorial"

export type TimetableSlot = {
  time: string
  subject: string
  code: string
  room: string
  faculty: string
  type: ClassType
}

export type TimetableDay = {
  day: string
  slots: TimetableSlot[]
}

// Batches are grouped by program. Undergraduate (B.Tech) runs four years, so we
// show the current fresher intake plus the three senior cohorts. Postgraduate
// (M.Tech) runs two years, so it has two active cohorts.
export const timetablePrograms = [
  {
    program: "Undergraduate (B.Tech)",
    batches: ["2026 - 2030", "2025 - 2029", "2024 - 2028", "2023 - 2027"],
  },
  {
    program: "Postgraduate (M.Tech)",
    batches: ["2026 - 2028", "2025 - 2027"],
  },
] as const

export const timetableBatches = [
  "2026 - 2030",
  "2025 - 2029",
  "2024 - 2028",
  "2023 - 2027",
  "2026 - 2028",
  "2025 - 2027",
] as const

export const timetableBranches = ["CSE", "IT", "AIML", "ECE", "ECE AI", "CSE AI", "Mechanical"] as const
export const timetableSections = ["A", "B", "C"] as const

export type TimetableBatch = (typeof timetableBatches)[number]
export type TimetableBranch = (typeof timetableBranches)[number]
export type TimetableSection = (typeof timetableSections)[number]

export const classTypeStyles: Record<ClassType, string> = {
  Lecture: "bg-violet-500/10 text-violet-600 ring-1 ring-inset ring-violet-500/20 dark:text-violet-300",
  Lab: "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",
  Tutorial: "bg-sky-500/10 text-sky-600 ring-1 ring-inset ring-sky-500/20 dark:text-sky-300",
}

type SubjectDef = { subject: string; code: string; faculty: string }

// Each branch has its own set of core subjects. CSE is fully fleshed out for the
// demo; the other branches carry a representative curriculum.
const branchSubjects: Record<TimetableBranch, SubjectDef[]> = {
  CSE: [
    { subject: "Data Structures", code: "CS201", faculty: "Dr. Mehta" },
    { subject: "Operating Systems", code: "CS204", faculty: "Dr. Iyer" },
    { subject: "Database Management", code: "CS206", faculty: "Dr. Sharma" },
    { subject: "Computer Networks", code: "CS208", faculty: "Dr. Verma" },
    { subject: "Discrete Mathematics", code: "MA203", faculty: "Dr. Rao" },
    { subject: "Technical Communication", code: "HS205", faculty: "Dr. Nair" },
  ],
  IT: [
    { subject: "Web Technologies", code: "IT201", faculty: "Dr. Bose" },
    { subject: "Data Structures", code: "IT202", faculty: "Dr. Mehta" },
    { subject: "Operating Systems", code: "IT204", faculty: "Dr. Iyer" },
    { subject: "Software Engineering", code: "IT206", faculty: "Dr. Menon" },
    { subject: "Database Systems", code: "IT208", faculty: "Dr. Sharma" },
  ],
  AIML: [
    { subject: "Machine Learning", code: "AI201", faculty: "Dr. Khanna" },
    { subject: "Linear Algebra", code: "MA202", faculty: "Dr. Rao" },
    { subject: "Data Structures", code: "AI203", faculty: "Dr. Mehta" },
    { subject: "Probability & Statistics", code: "MA205", faculty: "Dr. Das" },
    { subject: "Python for AI", code: "AI207", faculty: "Dr. Reddy" },
  ],
  ECE: [
    { subject: "Digital Electronics", code: "EC201", faculty: "Dr. Kapoor" },
    { subject: "Signals & Systems", code: "EC203", faculty: "Dr. Nanda" },
    { subject: "Network Theory", code: "EC205", faculty: "Dr. Pillai" },
    { subject: "Electromagnetics", code: "EC207", faculty: "Dr. Sen" },
    { subject: "Microprocessors", code: "EC209", faculty: "Dr. Gupta" },
  ],
  "ECE AI": [
    { subject: "Embedded AI", code: "ECA201", faculty: "Dr. Kapoor" },
    { subject: "Signals & Systems", code: "EC203", faculty: "Dr. Nanda" },
    { subject: "Machine Learning", code: "AI201", faculty: "Dr. Khanna" },
    { subject: "Digital Signal Processing", code: "ECA205", faculty: "Dr. Sen" },
    { subject: "IoT Systems", code: "ECA207", faculty: "Dr. Pillai" },
  ],
  "CSE AI": [
    { subject: "Artificial Intelligence", code: "CSA201", faculty: "Dr. Khanna" },
    { subject: "Data Structures", code: "CS201", faculty: "Dr. Mehta" },
    { subject: "Deep Learning", code: "CSA205", faculty: "Dr. Reddy" },
    { subject: "Operating Systems", code: "CS204", faculty: "Dr. Iyer" },
    { subject: "Data Mining", code: "CSA207", faculty: "Dr. Sharma" },
  ],
  Mechanical: [
    { subject: "Thermodynamics", code: "ME201", faculty: "Dr. Joshi" },
    { subject: "Fluid Mechanics", code: "ME203", faculty: "Dr. Rane" },
    { subject: "Engineering Mechanics", code: "ME205", faculty: "Dr. Kulkarni" },
    { subject: "Machine Design", code: "ME207", faculty: "Dr. Deshpande" },
    { subject: "Manufacturing Processes", code: "ME209", faculty: "Dr. Patil" },
  ],
}

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const LECTURE_TIMES = ["09:00 - 10:00", "10:00 - 11:00", "11:15 - 12:15", "02:00 - 03:00"]
const LAB_TIME = "02:00 - 04:00"

// Deterministically lays a branch's subjects across a five-day week. Alternate
// days end with a two-hour lab; the midday slot is a tutorial.
function buildWeek(subjects: SubjectDef[]): TimetableDay[] {
  return WEEK_DAYS.map((day, di) => {
    const labDay = di % 2 === 0
    const slots: TimetableSlot[] = LECTURE_TIMES.map((time, ti) => {
      const subj = subjects[(di * 2 + ti) % subjects.length]
      const isLab = labDay && ti === LECTURE_TIMES.length - 1
      return {
        time: isLab ? LAB_TIME : time,
        subject: isLab ? `${subj.subject} Lab` : subj.subject,
        code: isLab ? `${subj.code}L` : subj.code,
        room: isLab ? `Lab-${((di + ti) % 4) + 1}` : `LT-${(ti % 5) + 1}`,
        faculty: subj.faculty,
        type: isLab ? "Lab" : ti === 2 ? "Tutorial" : "Lecture",
      }
    })
    return { day, slots }
  })
}

const branchTimetables: Record<TimetableBranch, TimetableDay[]> = Object.fromEntries(
  timetableBranches.map((b) => [b, buildWeek(branchSubjects[b])]),
) as Record<TimetableBranch, TimetableDay[]>

/**
 * Returns the weekly timetable for a given batch, branch and section. Rooms are
 * shifted per batch and section so every cohort sees a distinct-but-consistent
 * schedule built from its branch's subjects.
 */
export function getTimetable(
  batch: TimetableBatch,
  branch: TimetableBranch,
  section: TimetableSection,
): TimetableDay[] {
  const sectionOffset = timetableSections.indexOf(section)
  const batchOffset = timetableBatches.indexOf(batch)
  const block = sectionOffset + batchOffset
  return branchTimetables[branch].map((d) => ({
    day: d.day,
    slots: d.slots.map((s) => ({
      ...s,
      room: s.room.includes("Lab")
        ? `Lab-${((Number(s.room.split("-")[1]) - 1 + block) % 4) + 1}`
        : `${s.room}${String.fromCharCode(65 + sectionOffset)}`,
    })),
  }))
}
