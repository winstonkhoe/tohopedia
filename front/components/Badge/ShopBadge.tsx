import Image from "next/image";

export function ShopIcon(props: { type: number }) {
  return (
    <Image
      src={`/logo/${
        props.type == 1
          ? "badge_pm.png"
          : props.type == 2
          ? "badge_pmp.svg"
          : props.type == 3
          ? "badge_os.png"
          : null
      }`}
      alt=""
      layout="fill"
    />
  );
}
