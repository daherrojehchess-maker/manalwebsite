import Link from "next/link";

export function ExpressPay() {
  return (
    <div>
      <p className="mb-2 text-center text-sm text-muted">תשלום מהיר</p>
      <div className="grid grid-cols-3 gap-2">
        <Link href="/checkout?pay=applepay" className="grid h-11 place-items-center rounded-md bg-black text-[15px] font-semibold text-white" aria-label="תשלום ב-Apple Pay">
          <span dir="ltr">Apple Pay</span>
        </Link>
        <Link href="/checkout?pay=googlepay" className="grid h-11 place-items-center rounded-md border border-line-strong bg-white text-[15px] font-semibold" aria-label="תשלום ב-Google Pay">
          <span dir="ltr">G Pay</span>
        </Link>
        <Link href="/checkout?pay=bit" className="grid h-11 place-items-center rounded-md bg-[#00B6BC] text-[16px] font-bold text-white" aria-label="תשלום ב-Bit">
          <span dir="ltr">bit</span>
        </Link>
      </div>
    </div>
  );
}
