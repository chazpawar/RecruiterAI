'use client';

import { useEffect, useRef } from 'react';

// SVG Icons for platforms
const LinkedInIcon = () => (
  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2"/>
  </svg>
);

const IndeedIcon = () => (
  <svg width="24" height="24" fill="#003A9B" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.566 21.5633v-8.762c.2553.0231.5009.0346.758.0346 1.2225 0 2.3739-.3206 3.3506-.8928v9.6182c0 .8219-.1957 1.4287-.5757 1.8338-.378.4033-.8808.6049-1.491.6049-.6007 0-1.0766-.2016-1.468-.6183-.3781-.4032-.5739-1.01-.5739-1.8184zM11.589.5659c2.5447-.8929 5.4424-.8449 7.6186.987.405.3687.8673.8334 1.0515 1.3806.2207.6913-.7695-.073-.9057-.167-.71-.4532-1.4182-.8334-2.2127-1.0946C12.8614.3873 8.8122 2.709 6.2945 6.315c-1.0516 1.5939-1.7367 3.2721-2.299 5.1174-.0614.2017-.1094.4647-.2207.6413-.1113.2036-.048-.5453-.048-.5702.0845-.7623.2438-1.4997.4414-2.237C5.3292 5.3375 7.897 2.0655 11.5891.5658zm4.9281 7.0587c0 1.6686-1.353 3.0224-3.0205 3.0224-1.6677 0-3.0186-1.3538-3.0186-3.0224 0-1.6687 1.351-3.0224 3.0186-3.0224 1.6676 0 3.0205 1.3518 3.0205 3.0224Z"/>
  </svg>
);

const GlassdoorIcon = () => (
  <svg width="24" height="24" fill="#00A162" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.1093.0006c-.0749-.0074-.1348.0522-.1348.127v3.451c0 .0673.0537.1194.121.127 2.619.172 4.6092.9501 4.6092 3.6814H13.086a.1343.1343 0 0 0-.1348.1347v8.9644c0 .0748.06.1347.1348.1347h10.0034c.0748 0 .1347-.0599.1347-.1347V7.342c0-2.2374-.7996-4.0558-2.4159-5.3279C19.3191.8469 17.0874.1428 14.1093.0006ZM.9107 7.387a.1342.1342 0 0 0-.1347.1347v8.9566c0 .0748.06.1347.1347.1347h5.6189c0 2.7313-1.9902 3.5094-4.6091 3.6815-.0674.0075-.1192.0596-.1192.127v3.451c0 .0747.06.1343.1348.1269 2.9781-.1422 5.2078-.8463 6.6969-2.0136 1.6163-1.272 2.4159-3.0905 2.4159-5.3278V7.5217a.1343.1343 0 0 0-.1348-.1347z"/>
  </svg>
);

const MonsterIcon = () => (
  <svg width="24" height="24" fill="#6D4C9F" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0V24H5.42V12.39L12 18.19L18.58 12.39V24H24V0L12 11.23L0 0Z"/>
  </svg>
);

const WellfoundIcon = () => (
  <svg width="24" height="24" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.998 8.128c.063-1.379-1.612-2.376-2.795-1.664-1.23.598-1.322 2.52-.156 3.234 1.2.862 2.995-.09 2.951-1.57zm0 7.748c.063-1.38-1.612-2.377-2.795-1.665-1.23.598-1.322 2.52-.156 3.234 1.2.863 2.995-.09 2.951-1.57zm-20.5 1.762L0 6.364h3.257l2.066 8.106 2.245-8.106h3.267l2.244 8.106 2.065-8.106h3.257l-3.54 11.274H11.39c-.73-2.713-1.46-5.426-2.188-8.14l-2.233 8.14H3.5z"/>
  </svg>
);

// Platform data - only platforms with available SVGs
const platforms = [
  { name: 'LinkedIn', icon: LinkedInIcon },
  { name: 'Indeed', icon: IndeedIcon },
  { name: 'Glassdoor', icon: GlassdoorIcon },
  { name: 'Monster', icon: MonsterIcon },
  { name: 'Wellfound', icon: WellfoundIcon },
];

// Platform logo component
const PlatformLogo = ({ name, icon: Icon }: { name: string; icon: React.FC }) => (
  <div 
    className="flex items-center justify-center gap-3 px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex-shrink-0 min-w-[140px]"
  >
    <Icon />
    <span className="text-gray-700 font-medium whitespace-nowrap">{name}</span>
  </div>
);

export default function HireFromAnywhere() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Clone items for seamless loop
    const scrollerContent = scroller.querySelector('.scroller-content') as HTMLElement;
    if (!scrollerContent) return;

    // Check if already duplicated
    if (scrollerContent.getAttribute('data-duplicated') === 'true') return;
    
    const items = Array.from(scrollerContent.children);
    // Clone items twice to ensure seamless loop without gaps
    for (let i = 0; i < 2; i++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true) as HTMLElement;
        scrollerContent.appendChild(clone);
      });
    }
    
    scrollerContent.setAttribute('data-duplicated', 'true');
  }, []);

  return (
    <section id="hire-from-anywhere" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 text-center mb-12">
        <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
          Post Once, Reach Everywhere
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          RecruiterAI automatically syncs your job postings across all major platforms
        </p>
      </div>

      {/* Infinite scrolling slider */}
      <div 
        ref={scrollerRef}
        className="relative w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="scroller-content flex gap-6 animate-scroll py-4">
          {platforms.map((platform, index) => (
            <PlatformLogo 
              key={index} 
              name={platform.name} 
              icon={platform.icon} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
