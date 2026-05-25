export default function Contact() {
  return (
    <div className="mx-auto w-full max-w-[760px] rounded-[24px] border border-slate-900/[0.08] bg-white/86 p-[28px] shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
      <h1 className="mt-0 text-[clamp(2rem,4vw,3rem)] text-[#0f172a]">
        Contact Us
      </h1>
      <p className="leading-[1.75] text-[#475569]">
        If you have any questions, feedback, or just want to say hello, feel
        free to reach out to us! We would love to hear from you.
      </p>
      <ul className="pl-[20px] leading-[1.75] text-[#475569]">
        <li>
          Email:{" "}
          <a className="text-[#4c51bf] underline-offset-4 hover:underline" href="mailto:info@myblog.com">
            info@myblog.com
          </a>
        </li>
      </ul>
    </div>
  );
}
