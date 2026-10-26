import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Gavel,
  Headphones,
  Home as HomeIcon,
  IndianRupee,
  LockKeyhole,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Stamp,
  UserRoundCheck,
} from "lucide-react";

const services = [
  { icon: <FileText />, title: "Property registration", text: "Guidance and paperwork support from start to finish." },
  { icon: <Search />, title: "Document checks", text: "Understand your records before you make a decision." },
  { icon: <Building2 />, title: "Khata & mutation", text: "Help with local records, transfers, and updates." },
  { icon: <FileCheck2 />, title: "Certificates & NOCs", text: "Get help preparing and filing the right documents." },
];

const steps = [
  { number: "01", title: "Tell us what you need", text: "Choose a service and share a few details about your property." },
  { number: "02", title: "Meet your local expert", text: "We connect you with a verified professional in your area." },
  { number: "03", title: "Track every update", text: "Follow the progress while your documents are handled." },
];

export default function Home() {
  return (
    <main className="home-page min-h-screen bg-[#f7f7f2] text-[#172b2a]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        .home-page { font-family: 'DM Sans', sans-serif; }
        .home-display { font-family: 'Manrope', sans-serif; }
      `}</style>

      <nav className="home-nav sticky top-0 z-50 border-b border-[#172b2a]/[0.07] bg-[#f7f7f2]/90 px-5 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="ESTATE-SYNC home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d514b] text-white shadow-md shadow-[#0d514b]/15"><Stamp size={20} /></span>
            <span className="home-display text-[17px] font-extrabold tracking-[-0.04em] text-[#17312f]">ESTATE-SYNC</span>
          </Link>
          <div className="hidden items-center gap-9 md:flex">
            <Link to="/" className="text-sm font-semibold text-[#0d514b]">Home</Link>
            <Link to="/services" className="text-sm font-medium text-[#647572] transition hover:text-[#0d514b]">Services</Link>
            <a href="#how-it-works" className="text-sm font-medium text-[#647572] transition hover:text-[#0d514b]">How it works</a>
            <Link to="/support" className="text-sm font-medium text-[#647572] transition hover:text-[#0d514b]">Support</Link>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-[#0d514b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0d514b]/15 transition hover:-translate-y-0.5 hover:bg-[#0a403b]">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="home-hero overflow-hidden px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-16">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0d514b]/15 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-[#0d514b] shadow-sm">
              <Sparkles size={14} /> Property paperwork, made simple
            </div>
            <h1 className="home-display max-w-2xl text-[clamp(3.3rem,7vw,6.5rem)] font-extrabold leading-[0.98] tracking-[-0.075em] text-[#17312f]">
              Your property work, <span className="text-[#0d7167]">in good hands.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#647572] sm:text-xl">
              Local experts help you handle registrations, records, and documents, with clear updates at every step.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/services" className="group inline-flex items-center gap-3 rounded-full bg-[#0d514b] px-7 py-4 font-bold text-white shadow-xl shadow-[#0d514b]/20 transition hover:-translate-y-1 hover:bg-[#0a403b]">
                Explore services <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/support" className="inline-flex items-center gap-2 rounded-full border border-[#17312f]/10 bg-white/70 px-6 py-4 font-bold text-[#17312f] transition hover:border-[#0d514b]/30 hover:bg-white">
                Talk to our team
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-[#647572]">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#0d7167]" /> Verified local professionals</span>
              <span className="inline-flex items-center gap-2"><LockKeyhole size={16} className="text-[#0d7167]" /> Your documents stay protected</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
            <div className="home-photo relative aspect-[1.04/1] overflow-hidden rounded-[2rem] bg-[#d9ded5] shadow-2xl shadow-[#193a34]/15 sm:rounded-[2.5rem]">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85" alt="Bright modern home surrounded by greenery" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102d28]/45 via-transparent to-white/5" />
              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/85 px-4 py-2 text-xs font-bold text-[#17312f] shadow-lg backdrop-blur-md sm:left-8 sm:top-8">
                <MapPin size={14} className="text-[#0d7167]" /> Local guidance, wherever you are
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white sm:bottom-8 sm:left-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Property support that feels personal</p>
                <p className="home-display mt-2 max-w-sm text-2xl font-bold leading-tight sm:text-3xl">A smoother way to take care of home.</p>
              </div>
            </div>

            <div className="home-status absolute -bottom-8 left-4 w-[min(88%,390px)] rounded-2xl border border-white/80 bg-white p-5 shadow-[0_24px_70px_-28px_rgba(17,51,45,0.4)] sm:-left-9 sm:bottom-10 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#81918d]">Application update</p>
                  <p className="mt-1 text-sm font-bold text-[#17312f]">Property registration</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f4ee] px-2.5 py-1 text-[10px] font-bold text-[#16705e]"><CheckCircle2 size={12} /> In progress</span>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d7167] text-white"><Check size={14} /></span>
                <span className="h-1 flex-1 rounded-full bg-[#0d7167]" />
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0d7167] bg-white"><span className="h-2 w-2 rounded-full bg-[#0d7167]" /></span>
                <span className="h-1 flex-1 rounded-full bg-[#e5eae6]" />
                <span className="h-7 w-7 rounded-full border-2 border-[#e5eae6] bg-white" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-semibold text-[#73847f]"><span>Request received</span><span>Expert review</span><span>Completed</span></div>
            </div>
            <div className="absolute -right-3 -top-5 hidden h-20 w-20 items-center justify-center rounded-3xl bg-[#d9a94a] text-[#17312f] shadow-xl sm:flex"><BadgeCheck size={34} strokeWidth={1.7} /></div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 pt-8 sm:px-8 sm:pb-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 rounded-3xl border border-[#17312f]/[0.07] bg-white p-5 shadow-[0_12px_40px_-30px_rgba(17,51,45,0.3)] sm:grid-cols-4 sm:p-7">
          <Metric value="5,000+" label="customers supported" />
          <Metric value="120+" label="local professionals" />
          <Metric value="4.9/5" label="customer rating" />
          <Metric value="One team" label="from request to update" />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24" id="services">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="What we can help with" title="Property paperwork, without the runaround." text="Get practical help with the details, documents, and local steps that matter." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link key={service.title} to="/services" className="home-service group rounded-3xl border border-[#17312f]/[0.08] bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-[#0d7167]/25 hover:shadow-xl hover:shadow-[#17312f]/[0.07]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f2ee] text-[#0d7167] transition group-hover:bg-[#0d514b] group-hover:text-white">{service.icon}</span>
                <h3 className="home-display mt-6 text-lg font-bold tracking-tight text-[#17312f]">{service.title}</h3>
                <p className="mt-2 min-h-[3rem] text-sm leading-6 text-[#71817d]">{service.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0d7167]">Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center"><Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-[#17312f]/10 px-6 py-3 text-sm font-bold text-[#17312f] transition hover:bg-white">See all services <ArrowDownRight size={16} /></Link></div>
        </div>
      </section>

      <section className="home-process px-5 py-20 sm:px-8 sm:py-24" id="how-it-works">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="A clear, simple process" title="Three steps. A little more peace of mind." text="We keep you informed, so you always know what happens next." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step) => <article key={step.number} className="relative rounded-3xl border border-white bg-white/75 p-7 sm:p-9"><span className="home-display text-5xl font-extrabold tracking-[-0.08em] text-[#dce9e3]">{step.number}</span><h3 className="home-display mt-5 text-xl font-bold text-[#17312f]">{step.title}</h3><p className="mt-3 leading-7 text-[#71817d]">{step.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="home-trust mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d514b] text-white shadow-2xl shadow-[#0d514b]/15 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b6d3c7]">Why ESTATE-SYNC</p>
            <h2 className="home-display mt-5 text-4xl font-extrabold leading-tight tracking-[-0.06em] sm:text-5xl">Good people. Clear progress. Less stress.</h2>
            <p className="mt-5 max-w-md leading-7 text-white/70">Property matters can feel complicated. We bring experienced local support and straightforward updates to every step.</p>
            <Link to="/services" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0d514b] transition hover:bg-[#e8f2ec]">Find your service <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            <TrustItem icon={<UserRoundCheck />} title="Local experts" text="People who know the process in your area." />
            <TrustItem icon={<ClipboardCheck />} title="Clear updates" text="Know where your request stands." />
            <TrustItem icon={<ShieldCheck />} title="Careful handling" text="Your documents treated with care." />
            <TrustItem icon={<Headphones />} title="Real support" text="A helpful team when you need us." />
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border border-[#17312f]/[0.08] bg-white p-8 sm:p-12 md:flex-row md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0d7167]">Straightforward fees</p><h2 className="home-display mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[#17312f] sm:text-4xl">Know what to expect.</h2><p className="mt-3 max-w-xl leading-7 text-[#71817d]">Platform fee starts at ₹499. Your service expert will explain any service costs before work begins.</p></div>
          <Link to="/services" className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#0d514b] px-6 py-4 font-bold text-white transition hover:bg-[#0a403b]">Browse services <ArrowRight size={17} /></Link>
        </div>
      </section>

      <footer className="border-t border-[#17312f]/[0.08] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Link to="/" className="home-display font-extrabold tracking-tight text-[#17312f]">ESTATE-SYNC</Link>
          <p className="text-sm text-[#71817d]">Property support, made a little simpler.</p>
          <Link to="/support" className="text-sm font-bold text-[#0d7167] hover:text-[#0a403b]">Contact support <ArrowRight size={14} className="ml-1 inline" /></Link>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0d7167]">{eyebrow}</p><h2 className="home-display mt-4 text-3xl font-extrabold leading-tight tracking-[-0.06em] text-[#17312f] sm:text-5xl">{title}</h2><p className="mt-4 leading-7 text-[#71817d] sm:text-lg">{text}</p></div>;
}

function Metric({ value, label }) {
  return <div className="px-2 py-2 text-center sm:px-4"><p className="home-display text-2xl font-extrabold tracking-[-0.05em] text-[#17312f] sm:text-3xl">{value}</p><p className="mt-1 text-xs font-medium text-[#82908c] sm:text-sm">{label}</p></div>;
}

function TrustItem({ icon, title, text }) {
  return <div className="flex gap-4 bg-[#0d514b] p-7 sm:p-9"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d7b775]">{icon}</span><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{text}</p></div></div>;
}
