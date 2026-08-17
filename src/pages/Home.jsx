import { Link } from "react-router-dom";
import {
  ShieldCheck,
  MapPin,
  Activity,
  ArrowRight,
  Building2,
  Gavel,
  ClipboardCheck,
  Zap,
  Search,
  Clock3,
  FileText,
  BadgeCheck,
  GitBranch,
  Home as HomeIcon,
  Headphones,
  Lock,
  IndianRupee,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#06152f]/95 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <HomeIcon size={25} />
            </div>

            <div className="text-xl font-black tracking-tight">
              <span className="text-blue-400">Goutam</span>
              <span className="text-white"> Property Work</span>
            </div>
          </Link>

          {/* NAVIGATION */}
          <div className="hidden items-center gap-8 lg:flex">

            <Link
              to="/"
              className="font-semibold text-blue-400"
            >
              Home
            </Link>

            <Link
              to="/services"
              className="font-medium text-slate-300 transition hover:text-white"
            >
              Services
            </Link>

            <Link
              to="/services"
              className="font-medium text-slate-300 transition hover:text-white"
            >
              How It Works
            </Link>

            <Link
              to="/"
              className="font-medium text-slate-300 transition hover:text-white"
            >
              About Us
            </Link>

            <Link
              to="/services"
              className="font-medium text-slate-300 transition hover:text-white"
            >
              Track Application
            </Link>

          </div>

          {/* REQUEST BUTTON */}
          <Link
            to="/services"
            className="hidden items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 sm:flex"
          >
            Start My Request
            <ArrowRight size={18} />
          </Link>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden bg-[#0b1428] px-6 pt-20 pb-28">

        {/* Background glow */}
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* LEFT */}
            <div>

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-bold tracking-wide text-blue-400">
                <Zap size={16} />
                THE EASIEST WAY TO HANDLE PROPERTY WORK
              </div>

              <h1 className="mb-7 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Property Work?

                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  Done From Home.
                </span>
              </h1>

              <p className="mb-9 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
                No more standing in long lines or visiting government
                offices multiple times. We connect you with local experts
                who handle your paperwork while you relax at home.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 hover:bg-blue-500"
                >
                  Start My Request

                  <ArrowRight
                    size={21}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <Activity size={20} />
                  See What We Do
                </Link>

              </div>

              {/* TRUST */}
              <div className="mt-7 flex items-center gap-2 text-sm text-slate-400">
                <ShieldCheck size={19} className="text-cyan-400" />
                Trusted by 5000+ customers across India
              </div>

            </div>


            {/* RIGHT */}
            <div className="relative">

              <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-1 shadow-2xl backdrop-blur-xl">

                <div className="rounded-[1.8rem] bg-[#17223a] p-7 sm:p-9">

                  <h2 className="mb-8 text-2xl font-black text-white sm:text-3xl">
                    Why choose{" "}
                    <span className="text-blue-400">
                      Goutam Property Work?
                    </span>
                  </h2>


                  {/* ITEM 1 */}
                  <div className="flex gap-5 border-b border-white/10 py-5">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                      <Clock3 size={28} />
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white">
                        No Waiting in Lines
                      </h3>

                      <p className="text-sm leading-6 text-slate-400">
                        Our agents visit the government offices
                        so you don't have to.
                      </p>
                    </div>

                  </div>


                  {/* ITEM 2 */}
                  <div className="flex gap-5 border-b border-white/10 py-5">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/20 text-green-400">
                      <ShieldCheck size={28} />
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white">
                        Safe & Verified
                      </h3>

                      <p className="text-sm leading-6 text-slate-400">
                        We only work with trusted local experts
                        who know the rules perfectly.
                      </p>
                    </div>

                  </div>


                  {/* ITEM 3 */}
                  <div className="flex gap-5 py-5">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                      <Search size={28} />
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white">
                        Easy Tracking
                      </h3>

                      <p className="text-sm leading-6 text-slate-400">
                        See the progress of your application
                        live from your phone.
                      </p>
                    </div>

                  </div>


                  {/* BRAND CARD */}
                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/5 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                        <Building2 size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Goutam Property Work
                        </p>

                        <p className="text-xs text-slate-400">
                          Property assistance made simple
                        </p>
                      </div>

                    </div>

                    <ShieldCheck
                      size={24}
                      className="text-green-400"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </header>


      {/* ================= PROPERTY SERVICES ================= */}
      <section className="bg-white px-6 py-20" id="services">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <h2 className="text-4xl font-black text-slate-900">
              We handle all types of property work
            </h2>

            <p className="mt-4 text-lg text-slate-500">
              Simple, reliable and professional property assistance.
            </p>

            <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-blue-600" />

          </div>


          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

            <ServiceCard
              icon={<FileText />}
              title="Property"
              subtitle="Registration"
            />

            <ServiceCard
              icon={<BadgeCheck />}
              title="Encumbrance"
              subtitle="Certificate"
            />

            <ServiceCard
              icon={<GitBranch />}
              title="Khata"
              subtitle="Transfer"
            />

            <ServiceCard
              icon={<HomeIcon />}
              title="Mutation"
              subtitle="Services"
            />

            <ServiceCard
              icon={<FileText />}
              title="NOC"
              subtitle="Services"
            />

            <ServiceCard
              icon={<Building2 />}
              title="And Many"
              subtitle="More..."
            />

          </div>

        </div>

      </section>


      {/* ================= WHY US ================= */}
      <section className="bg-slate-50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-16 text-center">

            <h2 className="text-4xl font-black text-slate-900">
              Why Goutam Property Work?
            </h2>

            <p className="mt-4 text-lg text-slate-500">
              We remove the chaos from property management.
            </p>

          </div>


          <div className="grid gap-8 md:grid-cols-3">

            <ValueCard
              icon={<ClipboardCheck size={28} />}
              title="Professional Liaison"
              text="Our agents handle physical visits and application filing at government and municipal offices for you."
            />

            <ValueCard
              icon={<Gavel size={28} />}
              title="Legal Verification"
              text="Get reliable property verification and local expert assistance before making important property decisions."
            />

            <ValueCard
              icon={<Activity size={28} />}
              title="Live Status Updates"
              text="Know exactly where your application stands without repeatedly calling agents or visiting offices."
            />

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="bg-[#061a3b] px-6 py-10">

        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">

          <Feature
            icon={<Headphones />}
            title="Expert Support"
            text="Local experts at your service"
          />

          <Feature
            icon={<Lock />}
            title="100% Secure"
            text="Your documents are safe with us"
          />

          <Feature
            icon={<IndianRupee />}
            title="Transparent Pricing"
            text="No hidden charges"
          />

          <Feature
            icon={<ShieldCheck />}
            title="Trusted Service"
            text="Reliable property assistance"
          />

        </div>

      </section>


      {/* ================= PRICING ================= */}
      <section className="bg-slate-900 px-6 py-12">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">

          <div className="text-center md:text-left">

            <h4 className="text-2xl font-bold text-white">
              Transparent Pricing
            </h4>

            <p className="mt-2 text-slate-400">
              Quality service shouldn't be expensive.
            </p>

          </div>


          <div className="flex gap-12">

            <div className="text-center">

              <p className="text-3xl font-black text-blue-400">
                ₹499
              </p>

              <p className="text-xs uppercase tracking-widest text-white opacity-60">
                Platform Fee
              </p>

            </div>


            <div className="text-center">

              <p className="text-3xl font-black text-cyan-400">
                3%
              </p>

              <p className="text-xs uppercase tracking-widest text-white opacity-60">
                Agent Commission
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


/* ================= SERVICE CARD ================= */

function ServiceCard({ icon, title, subtitle }) {
  return (
    <Link
      to="/services"
      className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
    >

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500">
        {subtitle}
      </p>

    </Link>
  );
}


/* ================= VALUE CARD ================= */

function ValueCard({ icon, title, text }) {
  return (
    <div className="group rounded-[2rem] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl">

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="leading-relaxed text-slate-500">
        {text}
      </p>

    </div>
  );
}


/* ================= FEATURE ================= */

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4 border-white/10 md:border-r md:pr-6">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
        {icon}
      </div>

      <div>

        <h3 className="font-bold text-white">
          {title}
        </h3>

        <p className="text-sm text-slate-400">
          {text}
        </p>

      </div>

    </div>
  );
}