'use client';

const testimonials = [
  {
    name: 'Rahul Mehta',
    title: 'Founder, TechStart Solutions',
    quote:
      'We went from 6 weeks to hire a developer to just 10 days. RecruiterAI handled everything from screening to scheduling. Game changer for our 5-person startup.',
    tag: 'Startup Founder',
  },
  {
    name: 'Maya Patel',
    title: 'Head of People, ScaleUp Labs',
    quote:
      'Our hiring pipeline finally feels predictable. The AI shortlists are accurate and the interview scheduling saves hours every week.',
    tag: 'HR Lead',
  },
  {
    name: 'Arjun Nair',
    title: 'Recruiting Manager, GrowthWorks',
    quote:
      'We doubled our interview capacity without adding more recruiters. The automated workflows keep candidates warm and engaged.',
    tag: 'Recruiting Manager',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            What Hiring Teams Say
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Real results from founders and hiring leaders using RecruiterAI.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-3xl border border-gray-200 bg-gray-50/70 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
                    <span className="text-sm font-semibold text-slate-900">
                      {testimonial.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  {testimonial.tag}
                </span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-gray-700">
                “{testimonial.quote}”
              </p>

              <div className="mt-6">
                <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                  Verified Hiring Team
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
