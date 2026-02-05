'use client';

const faqs = [
  {
    question: 'How does AI screening work?',
    answer:
      'RecruiterAI scans resumes and application data, scores candidates against your role criteria, and highlights the top matches automatically.',
  },
  {
    question: 'Does RecruiterAI integrate with our existing ATS?',
    answer:
      'Yes. RecruiterAI syncs with common ATS tools to keep your pipeline, notes, and hiring stages aligned.',
  },
  {
    question: 'What is the pricing structure?',
    answer:
      'Plans are flexible based on team size and hiring volume. You can start with a free trial and upgrade as you grow.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Most teams are live in under an hour. Create a role, customize your workflow, and start reviewing candidates right away.',
  },
  {
    question: 'Is candidate data secure?',
    answer:
      'Yes. Data is encrypted in transit and at rest, and access is controlled with role-based permissions.',
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">FAQ</h2>
          <p className="mt-4 text-lg text-gray-600">
            Quick answers to common questions about RecruiterAI.
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-gray-200 bg-gray-50/60 px-6 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-slate-900">
                <span>{faq.question}</span>
                <span className="text-slate-400 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
