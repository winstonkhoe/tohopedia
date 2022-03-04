import Image from "next/image";
import footer from "./powered.module.scss";

export function Powered() {
  return (
    <div className={footer.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <span className={footer.logo}>
          {/* <Image src="/logo/tohopedia_logo.png" alt='Tohopedia Logo' width={800} height={200}/> */}
          <Image
            src="/logo/tohopedia_logo.png"
            alt="Vercel Logo"
            width={72}
            height={16}
          />
          {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
        </span>
      </a>
    </div>
  );
}
