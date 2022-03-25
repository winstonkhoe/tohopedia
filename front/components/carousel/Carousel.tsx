import Image from "next/image";
import { Children, useEffect, useState } from "react";
import styles from "./carousel.module.scss";

const Carousel = (props: { srcs: string[], slideInterval: number}) => {
  const [currIndex, setCurrIndex] = useState(0);
  const handlePrev = () => {
    setCurrIndex(currIndex == 0 ? props.srcs.length - 1 : currIndex - 1);
  };

  const handleNext = () => {
    setCurrIndex(currIndex == props.srcs.length - 1 ? 0 : currIndex + 1);
  };

  useEffect(() => {
    const carouselInterval = setInterval(() => {
      handleNext();
    }, props.slideInterval);
      
      return () => clearInterval(carouselInterval)
  }, [handleNext]);

  return (
    <>
      <div className={styles.relative_container}>
        <div className={styles.container}>
          {props.srcs.map((src: string, index: number) => {
            return <Item key={index} src={src} index={currIndex} />;
          })}
        </div>
        {/* Left Button */}
        <div className={`${styles.nav_container} ${styles.nav_container_left}`}>
          <button
            className={`${styles.nav_button} ${styles.nav_left_button}`}
            onClick={handlePrev}
          >
            prev
          </button>
        </div>
        <div
          className={`${styles.nav_container} ${styles.nav_container_right}`}
        >
          <button
            className={`${styles.nav_button} ${styles.nav_right_button}`}
            onClick={handleNext}
          >
            next
          </button>
        </div>
      </div>
    </>
  );
};

const Item = (props: { src: string; index: number }) => {
  return (
    <div
      style={{ transform: `translateX(${-100 * props.index}%)` }}
      className={styles.image_container}
    >
      <Image src={props.src} alt="" layout="fill" objectFit="cover" />
    </div>
  );
};
export { Carousel, Item };
