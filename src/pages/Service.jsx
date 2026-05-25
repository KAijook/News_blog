export default function Service() {
  return (
    <div className="mx-auto w-full max-w-[760px] rounded-[24px] border border-slate-900/[0.08] bg-white/86 p-[28px] shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
      <h1 className="mt-0 text-[clamp(2rem,4vw,3rem)] text-[#0f172a]">
        Our Services
      </h1>
      <p className="leading-[1.75] text-[#475569]">
        We offer a wide range of services to help you achieve your goals.
        Whether you're looking for web development, digital marketing, or
        consulting, we have the expertise to deliver results.
      </p>
      <ul className="pl-[20px] leading-[1.75] text-[#475569]">
        <li className="mb-[8px]">
          Web Development: Building responsive and user-friendly websites.
        </li>
        <li className="mb-[8px]">
          Digital Marketing: Creating effective campaigns to grow your audience.
        </li>
        <li>
          Consulting: Providing expert advice to optimize your business
          strategies.
        </li>
      </ul>
    </div>
  );
}
