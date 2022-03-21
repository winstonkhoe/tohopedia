import Image from "next/image";

function ShopIcon(props: { type: number }) {
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

function ShopBadge(props: { reputation: number }) {
  return (
    <>
    <Image
      src={`/logo/badge/${
        props.reputation >= 1 && props.reputation <= 50
          ? "bronze_2.gif"
          : props.reputation >= 51 && props.reputation <= 100
          ? "silver_1.gif"
          : props.reputation >= 101 && props.reputation <= 150
          ? "gold_4.gif"
          : props.reputation >= 151
          ? "diamond_4.gif"
          : "no_badge.jpg"
      }`}
      alt=""
        layout="fill"
        objectFit="contain"
        objectPosition="left"
    />
    </>
    
  )
}

export {
  ShopIcon,
  ShopBadge
}
